const {
  otpEmailSchema,
  loginSchema,
  signupSchema,
} = require("../../server/src/validators/auth.validator");

describe("Auth validators", () => {
  it("otpEmailSchema accepts valid email", () => {
    const result = otpEmailSchema.safeParse({
      email: "student@example.com",
    });

    expect(result.success).toBe(true);
  });

  it("otpEmailSchema rejects invalid email", () => {
    const result = otpEmailSchema.safeParse({
      email: "invalid-email",
    });

    expect(result.success).toBe(false);
  });

  it("loginSchema requires password", () => {
    const result = loginSchema.safeParse({
      email: "student@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("signupSchema validates password confirmation and account type", () => {
    const result = signupSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "Password1",
      confirmPassword: "Password1",
      accountType: "Student",
      otp: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("signupSchema rejects mismatched passwords", () => {
    const result = signupSchema.safeParse({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      password: "Password1",
      confirmPassword: "Password2",
      accountType: "Student",
      otp: "123456",
    });

    expect(result.success).toBe(false);
  });
});
