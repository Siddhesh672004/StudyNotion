const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../../server/src/utils/imageUploader", () => ({
  uploadImageToCloudinary: jest.fn(),
}));

const app = require("../../server/src/app");
const Course = require("../../server/src/models/Course");
const Category = require("../../server/src/models/Category");
const Section = require("../../server/src/models/Section");
const SubSection = require("../../server/src/models/SubSection");
const User = require("../../server/src/models/User");
const { uploadImageToCloudinary } = require("../../server/src/utils/imageUploader");

const createInstructorToken = () =>
  jwt.sign(
    {
      id: "instructor-1",
      email: "instructor@example.com",
      accountType: "Instructor",
    },
    process.env.JWT_SECRET
  );

const createExecChain = (result) => {
  const chain = {
    populate() {
      return chain;
    },
    exec: async () => result,
  };

  return chain;
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Course builder API contracts", () => {
  it("POST /api/v1/course/createCourse accepts Authorization token even when stale cookie token exists", async () => {
    const token = createInstructorToken();

    uploadImageToCloudinary.mockResolvedValue({
      secure_url: "https://cdn.test/thumbnail.jpg",
    });

    jest.spyOn(User, "findById").mockResolvedValue({
      _id: "instructor-1",
      accountType: "Instructor",
    });

    jest.spyOn(Category, "findById").mockResolvedValue({
      _id: "category-1",
      name: "Programming",
    });

    jest.spyOn(Course, "create").mockResolvedValue({
      _id: "course-1",
      courseName: "Course Title",
      category: "category-1",
      instructor: "instructor-1",
      thumbnail: "https://cdn.test/thumbnail.jpg",
    });

    jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({
      _id: "instructor-1",
      courses: ["course-1"],
    });

    jest.spyOn(Category, "findByIdAndUpdate").mockResolvedValue({
      _id: "category-1",
      courses: ["course-1"],
    });

    const response = await request(app)
      .post("/api/v1/course/createCourse")
      .set("Authorization", `Bearer ${token}`)
      .set("Cookie", ["token=stale.invalid.token"])
      .field("courseName", "Course Title")
      .field("courseDescription", "Course Description")
      .field("whatYouWillLearn", "What you will learn")
      .field("price", "999")
      .field("category", "category-1")
      .field("tag", JSON.stringify(["test"]))
      .attach("thumbnailImage", Buffer.from("fake-image-content"), "thumb.jpg");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data._id).toBe("course-1");
  });

  it("POST /api/v1/course/addSection accepts quoted bearer token and returns updatedCourseDetails envelope", async () => {
    const token = createInstructorToken();

    jest.spyOn(Section, "create").mockResolvedValue({
      _id: "section-1",
      sectionName: "Introduction",
    });

    jest.spyOn(Course, "findByIdAndUpdate").mockImplementation(() =>
      createExecChain({
        _id: "course-1",
        courseContent: [
          {
            _id: "section-1",
            sectionName: "Introduction",
            subSection: [],
          },
        ],
      })
    );

    const response = await request(app)
      .post("/api/v1/course/addSection")
      .set("Authorization", `Bearer "${token}"`)
      .send({
        sectionName: "Introduction",
        courseId: "course-1",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data.updatedCourseDetails).toBeTruthy();
    expect(response.body.data.updatedCourseDetails._id).toBe("course-1");
    expect(response.body.data.updatedCourseDetails.courseContent[0].sectionName).toBe(
      "Introduction"
    );
  });

  it("POST /api/v1/course/addSubSection returns updatedSection under standardized envelope", async () => {
    const token = createInstructorToken();

    uploadImageToCloudinary.mockResolvedValue({
      secure_url: "https://cdn.test/video.mp4",
      duration: 120,
    });

    jest.spyOn(SubSection, "create").mockResolvedValue({
      _id: "sub-1",
      title: "Lecture 1",
      description: "Intro lecture",
      videoUrl: "https://cdn.test/video.mp4",
    });

    jest.spyOn(Section, "findByIdAndUpdate").mockImplementation(() =>
      createExecChain({
        _id: "section-1",
        sectionName: "Introduction",
        subSection: [
          {
            _id: "sub-1",
            title: "Lecture 1",
            description: "Intro lecture",
            videoUrl: "https://cdn.test/video.mp4",
          },
        ],
      })
    );

    const response = await request(app)
      .post("/api/v1/course/addSubSection")
      .set("Authorization", `Bearer ${token}`)
      .field("sectionId", "section-1")
      .field("title", "Lecture 1")
      .field("description", "Intro lecture")
      .attach("video", Buffer.from("dummy-video-content"), "lecture.mp4");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data.updatedSection).toBeTruthy();
    expect(response.body.data.updatedSection._id).toBe("section-1");
    expect(response.body.data.updatedSection.subSection.length).toBe(1);
  });

  it("POST /api/v1/course/updateSection returns updatedCourseDetails for client state sync", async () => {
    const token = createInstructorToken();

    jest.spyOn(Section, "findByIdAndUpdate").mockResolvedValue({
      _id: "section-1",
      sectionName: "Renamed Section",
    });

    jest.spyOn(Course, "findById").mockImplementation(() =>
      createExecChain({
        _id: "course-1",
        courseContent: [
          {
            _id: "section-1",
            sectionName: "Renamed Section",
            subSection: [],
          },
        ],
      })
    );

    const response = await request(app)
      .post("/api/v1/course/updateSection")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sectionName: "Renamed Section",
        sectionId: "section-1",
        courseId: "course-1",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.statusCode).toBe(200);
    expect(response.body.data.updatedCourseDetails).toBeTruthy();
    expect(response.body.data.updatedCourseDetails._id).toBe("course-1");
  });
});
