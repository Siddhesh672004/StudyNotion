const {
  createRazorpayOrder,
  verifyRazorpaySignature,
  enrollStudentsInCourses,
  sendPaymentSuccessMail,
} = require("../services/paymentService");
const { ApiResponse } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// capture the payment and initiate the Razorpay order
exports.capturePayment = asyncHandler(async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  const order = await createRazorpayOrder({ courses, userId });

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order created successfully"));
});

// verify Razorpay signature and enroll student
exports.verifySignature = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    courses,
  } = req.body;
  const userId = req.user.id;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses) {
    throw new AppError(400, "Payment verification payload is incomplete");
  }

  const isValid = verifyRazorpaySignature({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!isValid) {
    throw new AppError(400, "Invalid signature");
  }

  await enrollStudentsInCourses({ courses, userId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Payment verified"));
});

exports.sendPaymentSuccessEmail = asyncHandler(async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    throw new AppError(400, "Please provide all the fields");
  }

  await sendPaymentSuccessMail({
    orderId,
    paymentId,
    amount,
    userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Payment success email sent"));
});
