const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
require("dotenv").config();

//Send otp Controller
exports.sendOTP = async (req, res) => {
  try {
    //fetch email from request ki body
    const { email } = req.body;

    //check if user already exist
    const checkUserPresent = await User.findOne({ email });

    //if user already exists, then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP Generated: ", otp);

    //check the generated otp is unique or not
    //this code can be changed, Task: to find alternate pacakage which generate the unique otp itsef
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry for otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//SignUp controller

exports.signUp = async (req, res) => {
  console.log("Received Signup Body like this:", req.body);
  try {
    //data fetch from request ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    //validate the fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    //2no password ko match krlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password values does not match, please try again",
      });
    }

    //Check if the user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    //find the most recent otp stored for the user
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);

    //validate otp
    // if (recentOtp.length == 0) {
    //   //OTP not found
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP Not Found",
    //   });
    // } else if (otp !== recentOtp[0].otp) {
    //   //Invalid otp
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid OTP",
    //   });
    // }
    //validates the otp//validate otp
      if (recentOtp.length === 0) {
          return res.status(400).json({
              success: false,
              message: "OTP Not Found"
          });
      }

      if (otp !== recentOtp[0].otp.toString()) {
          return res.status(400).json({
              success: false,
              message: "Invalid OTP"
          });
      }

    //Hash Password
    const hashedpassword = await bcrypt.hash(password, 10);

    //Create an entry in database
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedpassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    //return response
    return res.status(200).json({
      success: true,
      message: "User is registered Successfully",
      user,
    });
  } 
  catch (error) {
    console.error("Signup Error =>", error.message);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered, please try again",
    });
  }
};

exports.login = async (req, res) => {
  try {
    //get data from req body
    const { email, password } = req.body;

    //validation of data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }

    //check if user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first",
      });
    }

    //generate JWT token, after password is matched
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      //create cookie and send response
      const options = {
        expires: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login failure, please try again",
    });
  }
};

//changePassword

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

// exports.changePassword = async(req,res)=>{

//     try
//     {

//         //get old password and new password and confirm password from req body
//         const{oldPassword,newPassword} = req.body;

//         //validation
//         if(!oldPassword || !newPassword )
//         {
//           return res.status(401).json({
//             success:false,
//             message:"All fields are required"
//           });
//         }

//         //find user by using id
//         //id present inside the user because all decoded information of token stored in user proerty

//         const userId = req.user.id;

//         const user = await User.findById(userId);

//         if(!user)
//         {
//           return res.status(401).json({
//             success:false,
//             message:"User is not registered`,please try again"
//           })
//         }

//         //mathing oldpassword with stored one

//         const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
//         if(!isPasswordMatch)
//         {
//           return res.status(400).json({
//             success:false,
//             message:"The Password Is Incorrect"
//           })
//         }
//         //match newpass and confirm pass
//         // if(newPassword !== confirmPassword)
//         // {
//         //    return res.status(401).json({
//         //     success:false,
//         //     message:"Password and confirm passwrd does not match"
//         //    })
//         // }

//         //hash new password
//         const hashedPassword = await bcrypt.hash(newPassword,10);

//         //save password indb
//          user.password = hashedPassword;
//          await user.save(); // or by usinf findyByIdAndUpdate

//          //send notifiaction email
//          try{
//           const emailResponse = await mailSender(
//             user.email,
//             "Password Changed Successfully",
//             `Hello ${user.firstName},\n\nYour password has been successfully changed on StudyNotion. If you didn't initiate this change, please contact our support team immediately.\n\nBest regards,\nThe StudyNotion Team`
//           );
//          }catch(error)
//          {
//           return res.status(500).json({
//             success:false,
//             message:`Error While Sending Notification Email(change password)`
//           });
//          }
//          //return res

//           return res.status(200).json({
//             success:false,
//             message:"Password Change Successfully"
//           });

//     }catch(error)
//     {
//         console.log(error);

//         return res.status(500).json({
//             success:false,
//             message:"Somenthing went wrong while changing Password",
//             error:error.message
//         });
//     }
// }
