const express = require("express");
const router = express.Router();

const { capturePayment, verifySignature, sendPaymentSuccessEmail } = require("../../controllers/Payments");

const { auth,
        isInstructor,
        isStudent,
        isAdmin
    } = require("../../middlewares/auth");

//API routes
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", auth, isStudent, verifySignature);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);
router.post("/verifyPayment", auth, isStudent, verifySignature);

module.exports = router;


