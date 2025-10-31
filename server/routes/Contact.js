const express = require("express");
const router = express.Router();

const { contactUsController } = require("../controllers/ContactUs");

//api route
router.post("/contactUsController", contactUsController);

module.exports = router;