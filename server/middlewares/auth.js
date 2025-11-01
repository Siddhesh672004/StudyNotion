const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth handler
exports.auth = async (req, res, next) => {
    try{
        //extract token from ....
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorization").replace("Bearer", "");
        
        //if token is missing, then return response
        if(!token) {
            return res.status(401).json({
                success: false,
                message: 'Token is missing',
            });
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            //IMP
            req.user = decode;
        }   
        catch(error) {
            console.log(error);
            return res.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        }
        next();
    }
    catch(error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
        });
    }
};

//isStudent middleware
exports.isStudent = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Students only',
            })
        }
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'USer role cannot be verified, please try again.',
        })
    }
}


//isInstructor middleware
exports.isInstructor = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Instructor") {
            return (401).json({
                success: false,
                message: 'This is a protected route for Instructor only',
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'USer role cannot be verified, please try again.',
        })
    }
}

//isAdmin middleware
exports.isAdmin = async (req, res, next) => {
    try {
        if(req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin only',
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: 'USer role cannot be verified, please try again.',
        })
    }
}
