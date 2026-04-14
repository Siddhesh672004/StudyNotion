const SubSection = require("../../server/src/models/SubSection");
const CourseProgress = require("../../server/src/models/CourseProgress");
const {
  getProgressPercentage,
  shouldTriggerCertificate,
  markLectureComplete,
} = require("../../server/src/services/progressService");

describe("Progress service", () => {
  it("getProgressPercentage returns 0 when total videos count is 0", () => {
    expect(getProgressPercentage(4, 0)).toBe(0);
  });

  it("getProgressPercentage returns rounded completion percentage", () => {
    expect(getProgressPercentage(2, 3)).toBe(67);
  });

  it("shouldTriggerCertificate returns true when all lectures are complete", () => {
    expect(shouldTriggerCertificate(5, 5)).toBe(true);
  });

  it("shouldTriggerCertificate returns false when lectures remain", () => {
    expect(shouldTriggerCertificate(4, 5)).toBe(false);
  });

  it("markLectureComplete throws when subsection does not exist", async () => {
    jest.spyOn(SubSection, "findById").mockResolvedValue(null);

    await expect(
      markLectureComplete({
        courseId: "course-1",
        subSectionId: "sub-1",
        userId: "student-1",
      })
    ).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("markLectureComplete creates progress and appends subsection", async () => {
    const progressDoc = {
      completedVideos: [],
      save: jest.fn(async () => {}),
    };

    jest.spyOn(SubSection, "findById").mockResolvedValue({ _id: "sub-1" });
    jest.spyOn(CourseProgress, "findOne").mockResolvedValue(null);
    jest.spyOn(CourseProgress, "create").mockResolvedValue(progressDoc);

    const result = await markLectureComplete({
      courseId: "course-1",
      subSectionId: "sub-1",
      userId: "student-1",
    });

    expect(result.completedVideos).toEqual(["sub-1"]);
    expect(progressDoc.save).toHaveBeenCalledTimes(1);
  });

  it("markLectureComplete rejects duplicate completion", async () => {
    const progressDoc = {
      completedVideos: ["sub-1"],
      save: jest.fn(async () => {}),
    };

    jest.spyOn(SubSection, "findById").mockResolvedValue({ _id: "sub-1" });
    jest.spyOn(CourseProgress, "findOne").mockResolvedValue(progressDoc);

    await expect(
      markLectureComplete({
        courseId: "course-1",
        subSectionId: "sub-1",
        userId: "student-1",
      })
    ).rejects.toMatchObject({
      statusCode: 409,
    });
  });
});
