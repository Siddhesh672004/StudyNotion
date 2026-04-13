const express = require("express");

const authRoutes = require("./User");
const profileRoutes = require("./Profile");
const courseRoutes = require("./Course");
const paymentRoutes = require("./Payment");
const contactRoutes = require("./Contact");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/course", courseRoutes);
router.use("/payment", paymentRoutes);
router.use("/reach", contactRoutes);

module.exports = router;
