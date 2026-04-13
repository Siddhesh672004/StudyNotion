const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const app = require("../../server/src/app");
const OTP = require("../../server/src/models/OTP");

test("POST /api/v1/auth/resendotp returns standardized envelope", async (t) => {
	const originalFindOne = OTP.findOne;
	const originalCreate = OTP.create;

	OTP.findOne = async () => null;
	OTP.create = async ({ email, otp }) => ({ email, otp });

	t.after(() => {
		OTP.findOne = originalFindOne;
		OTP.create = originalCreate;
	});

	const response = await request(app)
		.post("/api/v1/auth/resendotp")
		.send({ email: "tester@example.com" });

	assert.equal(response.status, 200);
	assert.equal(response.body.success, true);
	assert.equal(response.body.statusCode, 200);
	assert.equal(response.body.message, "OTP resent successfully");
	assert.equal(response.body.data.email, "tester@example.com");
});

test("POST /api/v1/auth/resendotp validates email and returns 422", async () => {
	const response = await request(app)
		.post("/api/v1/auth/resendotp")
		.send({ email: "bad-email" });

	assert.equal(response.status, 422);
	assert.equal(response.body.success, false);
	assert.equal(response.body.statusCode, 422);
});
