const { z } = require("zod");

const otpEmailSchema = z.object({
  email: z.string().email(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
    confirmPassword: z.string(),
    accountType: z.enum(["Student", "Instructor"]),
    otp: z.string().min(1),
    contactNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

module.exports = {
  otpEmailSchema,
  loginSchema,
  signupSchema,
};
