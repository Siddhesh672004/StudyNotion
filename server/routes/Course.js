const express = require("express");
const router = express.Router();

const { auth,
        isInstructor,
        isStudent,
        isAdmin
    } = require("../middlewares/auth");

const { createCourse, 
        showAllCourses,
        getCourseDetails 
      } = require("../controllers/Course");

const { createSection, 
        updateSection,
        deleteSection
    } = require("../controllers/Section");

const { createSubSection, 
    updateSubSection, 
    deleteSubSection 
    } = require("../controllers/Subsection");

const { createCategory,
        showAllCategories,
        categoryPageDetails
    } = require("../controllers/Category");

const { createRating,
        getAverageRating,
        getAllRating
    } = require("../controllers/RatingAndReview");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

//course can only be created by instructors
router.post("/createCourse", auth, isInstructor, createCourse);
// Get all Registered Courses
router.get("/showAllCourses", showAllCourses);
//Get details for a specific course
router.get("/getCourseDetails", getCourseDetails);

//add a section to a course
router.post("/addSection", auth, isInstructor, createSection);
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.get("/categoryPageDetails", categoryPageDetails);


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);


module.exports = router;