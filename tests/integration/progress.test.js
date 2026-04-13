const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";

const app = require("../../server/src/app");
const SubSection = require("../../server/src/models/SubSection");
const CourseProgress = require("../../server/src/models/CourseProgress");

const createStudentToken = () =>
	jwt.sign(
		{ id: "student-1", email: "student@example.com", accountType: "Student" },
		process.env.JWT_SECRET
	);

test("POST /api/v1/course/updateCourseProgress accepts subSectionId", async (t) => {
	const originalSubSectionFindById = SubSection.findById;
	const originalCourseProgressFindOne = CourseProgress.findOne;
	const originalCourseProgressCreate = CourseProgress.create;

	const progressDoc = {
		completedVideos: [],
		save: async () => {},
	};

	SubSection.findById = async (id) => ({ _id: id });
	CourseProgress.findOne = async () => progressDoc;
	CourseProgress.create = async () => progressDoc;

	t.after(() => {
		SubSection.findById = originalSubSectionFindById;
		CourseProgress.findOne = originalCourseProgressFindOne;
		CourseProgress.create = originalCourseProgressCreate;
	});

	const response = await request(app)
		.post("/api/v1/course/updateCourseProgress")
		.set("Authorization", `Bearer ${createStudentToken()}`)
		.send({ courseId: "course-1", subSectionId: "sub-1" });

	assert.equal(response.status, 200);
	assert.equal(response.body.success, true);
	assert.equal(response.body.data.subSectionId, "sub-1");
	assert.deepEqual(response.body.data.completedVideos, ["sub-1"]);
});

test("POST /api/v1/course/updateCourseProgress accepts legacy subsectionId", async (t) => {
	const originalSubSectionFindById = SubSection.findById;
	const originalCourseProgressFindOne = CourseProgress.findOne;
	const originalCourseProgressCreate = CourseProgress.create;

	const progressDoc = {
		completedVideos: [],
		save: async () => {},
	};

	SubSection.findById = async (id) => ({ _id: id });
	CourseProgress.findOne = async () => progressDoc;
	CourseProgress.create = async () => progressDoc;

	t.after(() => {
		SubSection.findById = originalSubSectionFindById;
		CourseProgress.findOne = originalCourseProgressFindOne;
		CourseProgress.create = originalCourseProgressCreate;
	});

	const response = await request(app)
		.post("/api/v1/course/updateCourseProgress")
		.set("Authorization", `Bearer ${createStudentToken()}`)
		.send({ courseId: "course-1", subsectionId: "sub-legacy" });

	assert.equal(response.status, 200);
	assert.equal(response.body.success, true);
	assert.equal(response.body.data.subSectionId, "sub-legacy");
	assert.deepEqual(response.body.data.completedVideos, ["sub-legacy"]);
});
