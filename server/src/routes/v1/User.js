const express = require("express");
const router = express.Router();

const { auth } = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {
    loginSchema,
    signupSchema,
    otpEmailSchema,
} = require("../../validators/auth.validator");

const { login,
        signUp,
        sendOTP,
                resendOtp,
        changePassword,
    } = require("../../controllers/Auth");

const { resetPasswordToken,
        resetPassword,
    } = require("../../controllers/ResetPassword");

    // Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", validate(loginSchema), login)

// Route for user signup
router.post("/signup", validate(signupSchema), signUp)

// Route for sending OTP to the user's email
router.post("/sendotp", validate(otpEmailSchema), sendOTP)

// Route for resending OTP to the user's email
router.post("/resendotp", validate(otpEmailSchema), resendOtp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

module.exports = router;