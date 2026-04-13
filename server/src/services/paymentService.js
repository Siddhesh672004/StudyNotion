const crypto = require("crypto");
const { default: mongoose } = require("mongoose");

const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const { sendEmail } = require("./emailService");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const AppError = require("../utils/AppError");

const validateCoursesForPayment = async ({ courses, userId }) => {
  if (!courses || !Array.isArray(courses) || courses.length === 0) {
    throw new AppError(400, "Please provide valid course IDs");
  }

  let totalAmount = 0;

  for (const courseId of courses) {
    const course = await Course.findById(courseId);

    if (!course) {
      throw new AppError(404, "Could not find the course");
    }

    const uid = new mongoose.Types.ObjectId(userId);
    const isAlreadyEnrolled = course.studentsEnrolled.some(
      (studentId) => studentId.toString() === uid.toString()
    );

    if (isAlreadyEnrolled) {
      throw new AppError(409, "Student is already enrolled");
    }

    totalAmount += course.price;
  }

  return totalAmount;
};

const createRazorpayOrder = async ({ courses, userId }) => {
  const amount = await validateCoursesForPayment({ courses, userId });

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      courses: JSON.stringify(courses),
      userId,
    },
  };

  return instance.orders.create(options);
};

const verifyRazorpaySignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

const enrollStudentsInCourses = async ({ courses, userId }) => {
  const enrolledStudent = await User.findById(userId);

  if (!enrolledStudent) {
    throw new AppError(404, "Student not found");
  }

  for (const courseId of courses) {
    const enrolledCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { studentsEnrolled: userId } },
      { new: true }
    );

    if (!enrolledCourse) {
      throw new AppError(404, "Course not found");
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

    await sendEmail({
      to: enrolledStudent.email,
      subject: `Successfully Enrolled into ${enrolledCourse.courseName}`,
      html: courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName),
    });
  }
};

const sendPaymentSuccessMail = async ({ orderId, paymentId, amount, userId }) => {
  const enrolledStudent = await User.findById(userId);

  if (!enrolledStudent) {
    throw new AppError(404, "Student not found");
  }

  await sendEmail({
    to: enrolledStudent.email,
    subject: "Payment Received",
    html: paymentSuccessEmail(
      `${enrolledStudent.firstName}`,
      amount / 100,
      orderId,
      paymentId
    ),
  });
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
  enrollStudentsInCourses,
  sendPaymentSuccessMail,
};
