const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


//Send otp Controller
exports.sendOTP = async(req, res) => {
    try {
        //fetch email from request ki body
        const { email } = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        //if user already exists, then return a response
        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            })
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
        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = { email, otp };

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response successful
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp,
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//SignUp controller

exports.signUp = async(req, res) => {
    try {
        //data fetch from request ki body
        const { firstName, 
                lastName,
                email, 
                password, 
                confirmPassword,
                accountType, 
                contactNumber, 
                otp
        } = req.body;

        //validate the fields
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required',
            })
        }

        //2no password ko match krlo
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: 'Password and Confirm Password values does not match, please try again',
            });
        }

        //Check if the user already exists or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false, 
                message: 'USer is already registered',
            });
        }

        //find the most recent otp stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length == 0) {
            //OTP not found
            return res.status(400).json({
                success: false,
                message: 'OTP Found',
            })
        } else if(otp !== recentOtp.otp) {
            //Invalid otp
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }

        //Hash Password
        const hashedpassword = await bcrypt.hash(password, 10);

        //Create an entry in database
        const profileDetails = await Profiler.create({
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
        })

        //return response
        return res.status(200).json({
            success: true,
            message: 'User is registered Successfully',
            user,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again',
        })
    }
};

exports.login = async (req, res) => {
    try {
        //get data from req body
        const { eamil, password } = req.body;

        //validation of data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required, please try again',
            });
        }

        //check if user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered, please signup first',
            });
        }

        //generate JWT token, after password is matched
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(Date.now() + 33*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: false,
                token,
                user,
                message: 'Logged in Successfully',
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            }); 
        }
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
                success: false,
                message: 'Login failure, please try again',
        }); 
    }
};

// //changePassword controller
// exports.changePassword = async (req, res) => {
//     try {
//         //get data from req ki body
//         const { oldPassword, newPassword, confirmNewPassword } = req.body;

//         //validation
//         if(!oldPassword || !newPassword || !confirmNewPassword) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'All fields are required, please try again',
//             });
//         }

//         if(newPassword !== confirmNewPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'New Password and Confirm New Password does not match, Please try again',
//             });
//         }

//         //update pwd in Db
//         if(newPassword == confirmNewPassword) {

//         }
//         //send email --> password updated

//         //return response

//     }
//     catch(error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: '',
//         })
//     }
// }















