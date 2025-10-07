const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60,
    },

});

//A Function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification mail from StudyNotion", otp);
        console.log("Email sent successfully", mailResponse);
    }
    catch(error) {
        console.log("Error occurred whiole sending mail: "error);
        throw error;
    }
}

//Pre save middleware, document db me save hone se just pehele ye code run hona chahiye
OTPSchema.pre("save", async function(next)) {
    await sendVerificationEmail(this.email, this.otp);
    next();
}


module.exports = mongoose.model("OTP", OTPSchema);