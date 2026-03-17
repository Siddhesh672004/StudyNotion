require("dotenv").config({ path: "./server/.env", quiet: true });
const crypto = require("crypto");

const orderId = process.argv[2];
const paymentId = process.argv[3];

if (!orderId || !paymentId || !process.env.RAZORPAY_SECRET) {
  process.exit(1);
}

const signature = crypto
  .createHmac("sha256", process.env.RAZORPAY_SECRET)
  .update(`${orderId}|${paymentId}`)
  .digest("hex");

process.stdout.write(signature);
