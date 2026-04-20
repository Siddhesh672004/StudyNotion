const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const { ApiResponse } = require("../utils/apiResponse");

exports.updateProfile = async (req, res) => {
    try {
        //get data
        const {
            firstName,
            lastName,
            dateOfBirth = "",
            about = "",
            contactNumber,
            gender,
        } = req.body;

        //get userId
        const id = req.user.id;

        //validation
        // if (!contactNumber || !id) {
        // return res.status(400).json({
        //     success: false,
        //     message: "All fields are required",
        // });
        // }

        //find profile
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: "Profile not found",
            });
        }

        //update user names when provided
        if (typeof firstName === "string" && firstName.trim().length > 0) {
            userDetails.firstName = firstName.trim();
        }
        if (typeof lastName === "string" && lastName.trim().length > 0) {
            userDetails.lastName = lastName.trim();
        }
        await userDetails.save();

        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        const updatedUserDetails = await User.findById(id)
            .populate("additionalDetails")
            .lean();

        //return response
        return res
            .status(200)
            .json(new ApiResponse(200, { updatedUserDetails }, "Profile updated"));
    } 
    catch (error) {
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
        });
    }
};

//Delete Account Function
// deleteAccount
// Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try {
        //we already created dummy profile at the time of sign up so their is no need to create new profile simply update that profile
        //get id
        //get user id --> from req mai user ke body mai present hai at the time of token creation payload ko user mai save kiya hai //get user id --> from req mai user kai body mai present hai at the time of token creation payload ko user mai save kiya hai
        const id = req.user.id;

        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
        }

        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

        // Unenroll user from all enrolled courses
        for (const courseId of userDetails.courses) {
            await Course.findByIdAndUpdate(courseId, {
                $pull: { studentsEnrolled: id },
            });
        }

        //delete user
        await User.findByIdAndDelete({ _id: id });

        //return response
        return res.status(200).json({
            success: true,
            message: 'User Deleted Successfully',
        });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User cannot be deleted',
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;

        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
                success: true,
                message: "User Data Fetched Successfully",
                data: userDetails,
            });
    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//update profile picture
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .exec();

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            });
        }
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });

    } 
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id });

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            // Create a new object with the additional fields
            const courseDataWithStats = {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                // Include other course properties as needed
                totalStudentsEnrolled,
                totalAmountGenerated,
            };

            return courseDataWithStats;
        });

        res.status(200).json({ courses: courseData });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



