const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../server/src/app");
const Course = require("../../server/src/models/Course");
const { instance } = require("../../server/src/config/razorpay");

const createStudentToken = (id = "507f1f77bcf86cd799439011") =>
	jwt.sign(
		{
			id,
			email: "student@example.com",
			accountType: "Student",
		},
		process.env.JWT_SECRET
	);

describe("Payment API contracts", () => {
	it("POST /api/v1/payment/capturePayment returns standardized order response", async () => {
		const validCourseId = "507f1f77bcf86cd799439012";

		jest.spyOn(Course, "findById").mockResolvedValue({
			_id: validCourseId,
			price: 999,
			studentsEnrolled: [],
		});

		jest.spyOn(instance.orders, "create").mockImplementation(async (options) => ({
			id: "order_test_123",
			amount: options.amount,
			currency: options.currency,
			receipt: options.receipt,
			notes: options.notes,
		}));

		const response = await request(app)
			.post("/api/v1/payment/capturePayment")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courses: [validCourseId] });

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.statusCode).toBe(200);
		expect(response.body.data.id).toBe("order_test_123");
		expect(response.body.data.amount).toBe(99900);
		expect(response.body.data.currency).toBe("INR");
	});

	it("POST /api/v1/payment/capturePayment rejects missing courses", async () => {
		const response = await request(app)
			.post("/api/v1/payment/capturePayment")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(400);
	});

	it("POST /api/v1/payment/capturePayment rejects invalid course IDs", async () => {
		const response = await request(app)
			.post("/api/v1/payment/capturePayment")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courses: ["course-1"] });

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(400);
	});
});
