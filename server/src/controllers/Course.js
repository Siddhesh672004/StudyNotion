const User = require("../models/User");
// const Category = require("../models/Category");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Category = require("../models/Category");
const { ApiResponse } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { markLectureComplete: markLectureCompleteInService } = require("../services/progressService");

// require("dotenv").config();

exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const { courseName, courseDescription, whatYouWillLearn, price, category, tag = []} =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail
    ) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details: ", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details not found",
      });
    }

    //check given Category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    //Upload image to  cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      tag: tag,
    });

    //add the new course to the user schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //Todo: update Category ka schema
    //newly created course gets added to the Category's courses array
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //return res
    return res.status(200).json({
      success: true,
      message: "Course created successfully,",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Somenthing went wrong while creating course",
      error: error.message,
    });
  }
};

//getAllCourses handler function
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
    .populate("instructor")
    .exec();

    return res.status(200).json({
        success: true,
        message: 'Data for all courses fetched successfully',
        data: allCourses,
    });  
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course data",
      error: error.message,
    });
  }
};

// getCourseDetails controller
exports.getCourseDetails = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId || req.body.courseId || req.query.courseId;

  if (!courseId) {
    throw new AppError(400, "courseId is required");
  }

  const course = await Course.findOne({ _id: courseId })
    .populate("instructor", "firstName lastName email image additionalDetails")
    .populate("category")
    .populate("ratingAndReviews")
    .populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .populate({
      path: "sections",
      populate: {
        path: "subSection",
      },
    })
    .lean();

  if (!course) {
    throw new AppError(404, "Course not found");
  }

  // Keep both keys available during migration.
  if ((!course.sections || course.sections.length === 0) && course.courseContent?.length) {
    course.sections = course.courseContent;
  }
  if (
    (!course.courseContent || course.courseContent.length === 0) &&
    course.sections?.length
  ) {
    course.courseContent = course.sections;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { course }, "Course fetched"));
});

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.markLectureComplete = asyncHandler(async (req, res) => {
  const { courseId, subSectionId, subsectionId } = req.body;
  const normalizedSubSectionId = subSectionId || subsectionId;
  const userId = req.user.id;

  if (!courseId || !normalizedSubSectionId) {
    throw new AppError(400, "courseId and subSectionId are required");
  }

  const courseProgress = await markLectureCompleteInService({
    courseId,
    subSectionId: normalizedSubSectionId,
    userId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courseId,
        subSectionId: normalizedSubSectionId,
        completedVideos: courseProgress.completedVideos,
      },
      "Lecture marked complete"
    )
  );
});

exports.updateCourseProgress = exports.markLectureComplete;
