const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");


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

