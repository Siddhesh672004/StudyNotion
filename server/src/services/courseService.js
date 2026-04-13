const Course = require("../models/Course");
const AppError = require("../utils/AppError");

const ensureCourseExists = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(404, "Course not found");
  }
  return course;
};

const isUserEnrolled = (course, userId) =>
  (course.studentsEnrolled || []).some(
    (studentId) => studentId.toString() === userId.toString()
  );

const assertUserNotEnrolled = (course, userId) => {
  if (isUserEnrolled(course, userId)) {
    throw new AppError(409, "Student is already enrolled");
  }
};

const canPublishCourse = (course) => {
  const hasMetadata =
    Boolean(course.courseName || course.title) &&
    Boolean(course.courseDescription || course.description) &&
    Boolean(course.thumbnail) &&
    Boolean(course.category);

  const hasContent =
    (course.courseContent && course.courseContent.length > 0) ||
    (course.sections && course.sections.length > 0);

  return hasMetadata && hasContent;
};

module.exports = {
  ensureCourseExists,
  isUserEnrolled,
  assertUserNotEnrolled,
  canPublishCourse,
};
