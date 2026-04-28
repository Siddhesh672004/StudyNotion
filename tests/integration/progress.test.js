const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../server/src/app");
const Course = require("../../server/src/models/Course");
const SubSection = require("../../server/src/models/SubSection");
const CourseProgress = require("../../server/src/models/CourseProgress");

const createCourseChain = (result) => {
	const chain = {
		select() {
			return chain;
		},
		populate() {
			return chain;
		},
		lean: async () => result,
	};

	return chain;
};

const createStudentToken = () =>
	jwt.sign(
		{ id: "student-1", email: "student@example.com", accountType: "Student" },
		process.env.JWT_SECRET
	);

describe("Course progress API contracts", () => {
	it("POST /api/v1/course/updateCourseProgress accepts subSectionId", async () => {
		const progressDoc = {
			completedVideos: [],
			save: jest.fn(async () => {}),
		};

		jest.spyOn(Course, "findById").mockImplementation(() =>
			createCourseChain({
				_id: "course-1",
				studentsEnrolled: ["student-1"],
				courseContent: [{ _id: "section-1", subSection: ["sub-1"] }],
			})
		);
		jest.spyOn(SubSection, "findById").mockImplementation(async (id) => ({ _id: id }));
		jest.spyOn(CourseProgress, "findOne").mockResolvedValue(progressDoc);
		jest.spyOn(CourseProgress, "create").mockResolvedValue(progressDoc);

		const response = await request(app)
			.post("/api/v1/course/updateCourseProgress")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courseId: "course-1", subSectionId: "sub-1" });

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.subSectionId).toBe("sub-1");
		expect(response.body.data.completedVideos).toEqual(["sub-1"]);
	});

	it("POST /api/v1/course/updateCourseProgress accepts legacy subsectionId", async () => {
		const progressDoc = {
			completedVideos: [],
			save: jest.fn(async () => {}),
		};

		jest.spyOn(Course, "findById").mockImplementation(() =>
			createCourseChain({
				_id: "course-1",
				studentsEnrolled: ["student-1"],
				courseContent: [{ _id: "section-1", subSection: ["sub-legacy"] }],
			})
		);
		jest.spyOn(SubSection, "findById").mockImplementation(async (id) => ({ _id: id }));
		jest.spyOn(CourseProgress, "findOne").mockResolvedValue(progressDoc);
		jest.spyOn(CourseProgress, "create").mockResolvedValue(progressDoc);

		const response = await request(app)
			.post("/api/v1/course/updateCourseProgress")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courseId: "course-1", subsectionId: "sub-legacy" });

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.subSectionId).toBe("sub-legacy");
		expect(response.body.data.completedVideos).toEqual(["sub-legacy"]);
	});

	it("POST /api/v1/course/updateCourseProgress rejects duplicate completion", async () => {
		const progressDoc = {
			completedVideos: ["sub-duplicate"],
			save: jest.fn(async () => {}),
		};

		jest.spyOn(Course, "findById").mockImplementation(() =>
			createCourseChain({
				_id: "course-1",
				studentsEnrolled: ["student-1"],
				courseContent: [{ _id: "section-1", subSection: ["sub-duplicate"] }],
			})
		);
		jest
			.spyOn(SubSection, "findById")
			.mockImplementation(async (id) => ({ _id: id }));
		jest.spyOn(CourseProgress, "findOne").mockResolvedValue(progressDoc);

		const response = await request(app)
			.post("/api/v1/course/updateCourseProgress")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courseId: "course-1", subSectionId: "sub-duplicate" });

		expect(response.status).toBe(409);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(409);
	});

	it("POST /api/v1/course/updateCourseProgress rejects students not enrolled in course", async () => {
		jest.spyOn(Course, "findById").mockImplementation(() =>
			createCourseChain({
				_id: "course-1",
				studentsEnrolled: ["another-student"],
				courseContent: [{ _id: "section-1", subSection: ["sub-1"] }],
			})
		);
		jest.spyOn(SubSection, "findById").mockImplementation(async (id) => ({ _id: id }));

		const response = await request(app)
			.post("/api/v1/course/updateCourseProgress")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courseId: "course-1", subSectionId: "sub-1" });

		expect(response.status).toBe(403);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(403);
	});
});
