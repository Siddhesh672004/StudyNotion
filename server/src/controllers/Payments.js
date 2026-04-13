const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");

const enrollStudents = async (courses, userId) => {
    const enrolledStudent = await User.findById(userId);

    if (!enrolledStudent) {
        throw new Error("Student not found");
    }

    for (const courseId of courses) {
        const enrolledCourse = await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { studentsEnrolled: userId } },
            { new: true }
        );

        if (!enrolledCourse) {
            throw new Error("Course not Found");
        }

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { courses: courseId } },
            { new: true }
        );

        await CourseProgress.findOneAndUpdate(
            { courseID: courseId, userId },
            {
                $setOnInsert: {
                    courseID: courseId,
                    userId,
                    completedVideos: [],
                },
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        await mailSender(
            enrolledStudent.email,
            `Successfully Enrolled into ${enrolledCourse.courseName}`,
            courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName)
        );
    }
};

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    //get courseIds and UserID
    const { courses } = req.body;
    const userId = req.user.id;

    //validation
    //valid courseIDs
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
        return res.json({
        success: false,
        message: 'Please provide valid course IDs',
        });
    }

    let totalAmount = 0;

    try {
        for (const course_id of courses) {
            const course = await Course.findById(course_id);
            if (!course) {
                return res.json({
                    success: false,
                    message: 'Could not find the course',
                });
            }

            //user already paid for the same course
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.some((studentId) => studentId.toString() === uid.toString())) {
                return res.status(200).json({
                    success: false,
                    message: 'Student is already enrolled',
                });
            }

            totalAmount += course.price;
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
    const amount = totalAmount;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courses: JSON.stringify(courses),
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
            data: paymentResponse,
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses) {
        return res.status(400).json({
            success: false,
            message: "Payment Failed",
        });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid signature",
        });
    }

    try {
        await enrollStudents(courses, userId);

        return res.status(200).json({
            success: true,
            message: "Payment Verified",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body;

    const userId = req.user.id;

    if (!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the fields",
        });
    }

    try {
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstName}`,
            amount/100,
            orderId, paymentId)
        );

        return res.status(200).json({
            success: true,
            message: "Payment success email sent",
        });
    } 
    catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({
            success: false,
            message: "Could not send email",
        })
    }
}
