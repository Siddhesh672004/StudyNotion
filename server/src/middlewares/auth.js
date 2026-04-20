const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

const normalizeToken = (value) => {
    if (typeof value !== "string") {
        return null;
    }

    let token = value.trim();
    if (!token) {
        return null;
    }

    // Trim wrapping quotes and duplicated Bearer prefixes from legacy/stale client storage formats.
    token = token.replace(/^['"]+|['"]+$/g, "");
    while (/^Bearer\s+/i.test(token)) {
        token = token.replace(/^Bearer\s+/i, "").trim();
    }
    token = token.replace(/^['"]+|['"]+$/g, "");

    if (!token || token === "undefined" || token === "null") {
        return null;
    }

    return token;
};

//auth handler
exports.auth = async (req, res, next) => {
    try{
        // Prefer Authorization header so stale cookies do not override fresh bearer tokens.
        const authHeader = req?.header("Authorization") || req?.header("authorization");
        const tokenCandidates = [authHeader, req?.body?.token, req?.cookies?.token];
        let token = null;

        for (const candidate of tokenCandidates) {
            const normalized = normalizeToken(candidate);
            if (normalized) {
                token = normalized;
                break;
            }
        }
        
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
            //IMP
            req.user = decode;
        }   
        catch(error) {
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
        next();
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
            return res.status(401).json({
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
