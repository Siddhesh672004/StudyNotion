const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  accountType: z.enum(["Student", "Instructor", "Admin"]),
  otp: z.string().min(1),
});

module.exports = {
  loginSchema,
  signupSchema,
};
