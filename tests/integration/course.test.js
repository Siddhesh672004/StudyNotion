const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../../server/src/app");
const Course = require("../../server/src/models/Course");

const createQueryChain = (result) => {
	const chain = {
		populate() {
			return chain;
		},
		lean: async () => result,
	};

	return chain;
};

test("POST /api/v1/course/getCourseDetails returns object envelope", async (t) => {
	const originalFindOne = Course.findOne;

	Course.findOne = () =>
		createQueryChain({
			_id: "course-1",
			courseName: "Contract Testing",
			instructor: { firstName: "Ada", lastName: "Lovelace" },
			courseContent: [],
			sections: [],
			ratingAndReviews: [],
		});

	t.after(() => {
		Course.findOne = originalFindOne;
	});

	const response = await request(app)
		.post("/api/v1/course/getCourseDetails")
		.send({ courseId: "course-1" });

	assert.equal(response.status, 200);
	assert.equal(response.body.success, true);
	assert.equal(response.body.statusCode, 200);
	assert.ok(response.body.data.course);
	assert.equal(response.body.data.course._id, "course-1");
	assert.equal(response.body.data.course.courseName, "Contract Testing");
});
