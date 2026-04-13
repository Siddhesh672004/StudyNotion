const CourseProgress = require("../models/CourseProgress");
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
  const subsection = await SubSection.findById(subSectionId);
  if (!subsection) {
    throw new AppError(404, "Invalid subSectionId");
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
