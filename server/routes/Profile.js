const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

const { updateProfile, 
        deleteAccount, 
        getAllUserDetails
    } = require("../controllers/Profile");

// Delet User Account
router.delete("/deleteAccount", auth, deleteAccount)

router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

module.exports = router;