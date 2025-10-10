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
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }   
        catch(error) {
            console.log(error);
            return res.status.status(401).json({
                success: false,
                message: 'Token is invalid',
            });
        }
        next();
    }
    catch(error) {
        return res.status.status(401).json({
            success: false,
            message: 'Something went wrong while validating the token',
        });
    }
}

