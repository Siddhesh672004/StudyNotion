const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    //get courseId and UserID
    const { course_id } = req.body;
    const userId = req.user.id;

    //validation
    //valid courseID
    if (!course_id) {
        return res.json({
        success: false,
        message: 'Please provide valid course ID',
        });
    }

    //valid courseDetail
    let course;
    try {
        course = await Course.findById(course_id);
        if (!course) {
        return res.json({
            success: false,
            message: 'Could not find the course',
        });
        }

        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
        return res.status(200).json({
            success: false,
            message: 'Student is already enrolled',
        });
        }
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
        courseId: course_id,
        userId,
        },
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
        });
    }
};

// verify Signature of Razorpay and Server

exports.verifySignature = async (req, res) => {
    // yeh secret Razorpay webhook ka shared secret hota hai
    const webhookSecret = "12345678";

    // Razorpay ne jo signature header me bheja hai usse nikaal lo
    const signature = req.headers["x-razorpay-signature"];

    // HMAC bana rahe hain: server side same payload + secret se digest create hoga
    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body)); 
    const digest = shasum.digest("hex"); 

    if (signature === digest) {
        console.log("Payment is Authorised");

        // Razorpay payload ke notes se courseId aur userId nikaal lo
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
        // fulfil the action
        // course dhundo aur usme student ko enroll kar do (studentsEnrolled me push)
        const enrolledCourse = await Course.findOneAndUpdate(
            { _id: courseId },                 
            { $push: { studentsEnrolled: userId } }, 
            { new: true }                      
        );

        if (!enrolledCourse) {
            return res.status(500).json({
                success: false,
                message: "Course not Found",
            });
        }

        console.log(enrolledCourse);

        // ab user document me bhi course ko add karo (user ke enrolled courses me)
        const enrolledStudent = await User.findOneAndUpdate(
            { _id: userId },                   
            { $push: { courses: courseId } },  
            { new: true }
        );

        console.log(enrolledStudent);

        // confirmation email bhej do: "payment + enrollment done"
        const emailResponse = await mailSender(
            enrolledStudent.email,
            "Congratulations from StudyNotion Team",
            "Congratulations, you are onboarded into new StudyNotion Course"
        );

        console.log(emailResponse);

        // final success response
        return res.status(200).json({
            success: true,
            message: "Signature Verified and Course Added",
        });
        } 
        catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    } 
    else {
        return res.status(400).json({
            success: false,
            message: "Invalid request",
        });
    }
};
