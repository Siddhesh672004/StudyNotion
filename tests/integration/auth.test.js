const request = require("supertest");

const app = require("../../server/src/app");
const OTP = require("../../server/src/models/OTP");

describe("Auth API contracts", () => {
	it("POST /api/v1/auth/resendotp returns standardized envelope", async () => {
		const findOneSpy = jest.spyOn(OTP, "findOne").mockResolvedValue(null);
		const createSpy = jest
			.spyOn(OTP, "create")
			.mockImplementation(async ({ email, otp }) => ({ email, otp }));

		const response = await request(app)
			.post("/api/v1/auth/resendotp")
			.send({ email: "tester@example.com" });

		expect(findOneSpy).toHaveBeenCalled();
		expect(createSpy).toHaveBeenCalled();
		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.statusCode).toBe(200);
		expect(response.body.message).toBe("OTP resent successfully");
		expect(response.body.data.email).toBe("tester@example.com");
	});

	it("POST /api/v1/auth/resendotp validates email and returns 422", async () => {
		const response = await request(app)
			.post("/api/v1/auth/resendotp")
			.send({ email: "bad-email" });

		expect(response.status).toBe(422);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(422);
	});
});
