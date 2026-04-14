jest.mock("../../server/src/services/paymentService", () => ({
  createRazorpayOrder: jest.fn(),
  verifyRazorpaySignature: jest.fn(),
  enrollStudentsInCourses: jest.fn(),
  sendPaymentSuccessMail: jest.fn(),
}));

const paymentService = require("../../server/src/services/paymentService");
const {
  capturePayment,
  verifySignature,
  sendPaymentSuccessEmail,
} = require("../../server/src/controllers/Payments");

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Payments controller", () => {
  it("capturePayment returns a standardized order payload", async () => {
    const req = {
      body: { courses: ["course-1"] },
      user: { id: "student-1" },
    };
    const res = createResponse();
    const next = jest.fn();

    paymentService.createRazorpayOrder.mockResolvedValue({
      id: "order_123",
      amount: 5000,
      currency: "INR",
    });

    await capturePayment(req, res, next);

    expect(paymentService.createRazorpayOrder).toHaveBeenCalledWith({
      courses: ["course-1"],
      userId: "student-1",
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        statusCode: 200,
        data: expect.objectContaining({ id: "order_123" }),
      })
    );
  });

  it("verifySignature rejects incomplete payloads", async () => {
    const req = {
      body: {
        razorpay_order_id: "",
      },
      user: { id: "student-1" },
    };
    const res = createResponse();
    const next = jest.fn();

    await verifySignature(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
      })
    );
  });

  it("verifySignature rejects invalid signatures", async () => {
    const req = {
      body: {
        razorpay_order_id: "order_123",
        razorpay_payment_id: "payment_123",
        razorpay_signature: "bad-signature",
        courses: ["course-1"],
      },
      user: { id: "student-1" },
    };
    const res = createResponse();
    const next = jest.fn();

    paymentService.verifyRazorpaySignature.mockReturnValue(false);

    await verifySignature(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
      })
    );
    expect(paymentService.enrollStudentsInCourses).not.toHaveBeenCalled();
  });

  it("verifySignature enrolls courses on valid signature", async () => {
    const req = {
      body: {
        razorpay_order_id: "order_123",
        razorpay_payment_id: "payment_123",
        razorpay_signature: "valid-signature",
        courses: ["course-1"],
      },
      user: { id: "student-1" },
    };
    const res = createResponse();
    const next = jest.fn();

    paymentService.verifyRazorpaySignature.mockReturnValue(true);
    paymentService.enrollStudentsInCourses.mockResolvedValue();

    await verifySignature(req, res, next);

    expect(paymentService.enrollStudentsInCourses).toHaveBeenCalledWith({
      courses: ["course-1"],
      userId: "student-1",
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("sendPaymentSuccessEmail validates required payload", async () => {
    const req = {
      body: {
        orderId: "",
      },
      user: { id: "student-1" },
    };
    const res = createResponse();
    const next = jest.fn();

    await sendPaymentSuccessEmail(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
      })
    );
  });

  it("sendPaymentSuccessEmail sends acknowledgment when payload is valid", async () => {
    const req = {
      body: {
        orderId: "order_123",
        paymentId: "payment_123",
        amount: 5000,
      },
      user: { id: "student-1" },
    };
    const res = createResponse();
    const next = jest.fn();

    paymentService.sendPaymentSuccessMail.mockResolvedValue();

    await sendPaymentSuccessEmail(req, res, next);

    expect(paymentService.sendPaymentSuccessMail).toHaveBeenCalledWith({
      orderId: "order_123",
      paymentId: "payment_123",
      amount: 5000,
      userId: "student-1",
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        statusCode: 200,
      })
    );
  });
});
