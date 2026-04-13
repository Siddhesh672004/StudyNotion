const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const app = require("../../server/src/app");
const Course = require("../../server/src/models/Course");
const { instance } = require("../../server/src/config/razorpay");

const createStudentToken = () =>
	jwt.sign(
		{
			id: "507f1f77bcf86cd799439011",
			email: "student@example.com",
			accountType: "Student",
		},
		process.env.JWT_SECRET
	);

test("POST /api/v1/payment/capturePayment returns standardized order response", async (t) => {
	const originalFindById = Course.findById;
	const originalOrderCreate = instance.orders.create;

	Course.findById = async () => ({
		_id: "course-1",
		price: 999,
		studentsEnrolled: [],
	});

	instance.orders.create = async (options) => ({
		id: "order_test_123",
		amount: options.amount,
		currency: options.currency,
		receipt: options.receipt,
		notes: options.notes,
	});

	t.after(() => {
		Course.findById = originalFindById;
		instance.orders.create = originalOrderCreate;
	});

	const response = await request(app)
		.post("/api/v1/payment/capturePayment")
		.set("Authorization", `Bearer ${createStudentToken()}`)
		.send({ courses: ["course-1"] });

	assert.equal(response.status, 200);
	assert.equal(response.body.success, true);
	assert.equal(response.body.statusCode, 200);
	assert.equal(response.body.data.id, "order_test_123");
	assert.equal(response.body.data.amount, 99900);
	assert.equal(response.body.data.currency, "INR");
});
