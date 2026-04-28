const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
const AppError = require("../utils/AppError");

const getProgressPercentage = (completedVideosCount, totalVideosCount) => {
  if (!totalVideosCount) {
    return 0;
  }

  return Math.round((completedVideosCount / totalVideosCount) * 100);
};

const shouldTriggerCertificate = (completedVideosCount, totalVideosCount) =>
  totalVideosCount > 0 && completedVideosCount >= totalVideosCount;

const markLectureComplete = async ({ courseId, subSectionId, userId }) => {
  const course = await Course.findById(courseId)
    .select("studentsEnrolled courseContent")
    .populate({
      path: "courseContent",
      select: "subSection",
    })
    .lean();

  if (!course) {
    throw new AppError(404, "Course not found");
  }

  const isEnrolled = course.studentsEnrolled?.some(
    (student) => String(student) === String(userId)
  );

  if (!isEnrolled) {
    throw new AppError(403, "You need to enroll in this course before tracking progress");
  }

  const subsection = await SubSection.findById(subSectionId);
  if (!subsection) {
    throw new AppError(404, "Invalid subSectionId");
  }

  const isSubSectionPartOfCourse = course.courseContent?.some((section) =>
    section?.subSection?.some((id) => String(id) === String(subSectionId))
  );

  if (!isSubSectionPartOfCourse) {
    throw new AppError(400, "subSectionId does not belong to this course");
  }

  let courseProgress = await CourseProgress.findOne({
    courseID: courseId,
    userId,
  });

  if (!courseProgress) {
    courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId,
      completedVideos: [],
    });
  }

  if (courseProgress.completedVideos.includes(subSectionId)) {
    throw new AppError(409, "Lecture already marked as complete");
  }

  courseProgress.completedVideos.push(subSectionId);
  await courseProgress.save();

  return courseProgress;
};

module.exports = {
  getProgressPercentage,
  shouldTriggerCertificate,
  markLectureComplete,
};
