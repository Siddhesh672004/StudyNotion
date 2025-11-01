const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");

const { updateProfile, 
        deleteAccount, 
        getAllUserDetails,
        updateDisplayPicture
    } = require("../controllers/Profile");

// Delet User Account
router.delete("/deleteAccount", auth, deleteAccount)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)

module.exports = router;