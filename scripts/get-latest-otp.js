require("dotenv").config({ path: "./server/.env", quiet: true });
const mongoose = require("../server/node_modules/mongoose");
const OTP = require("../server/models/OTP");

(async () => {
  try {
    const email = process.argv[2];
    if (!email) {
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URL);
    const doc = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (doc) {
      process.stdout.write(String(doc.otp));
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch {
    try {
      await mongoose.disconnect();
    } catch {}
    process.exit(1);
  }
})();
