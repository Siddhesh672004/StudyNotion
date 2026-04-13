const Razorpay = require("razorpay");

const hasRazorpayConfig =
    Boolean(process.env.RAZORPAY_KEY) && Boolean(process.env.RAZORPAY_SECRET);

const instance = hasRazorpayConfig
    ? new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET,
        })
    : {
            orders: {
                create: async () => {
                    throw new Error(
                        "Razorpay is not configured. Set RAZORPAY_KEY and RAZORPAY_SECRET."
                    );
                },
            },
        };

exports.instance = instance;