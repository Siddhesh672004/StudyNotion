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

describe("Course API contracts", () => {
	it("POST /api/v1/course/getCourseDetails returns object envelope", async () => {
		jest.spyOn(Course, "findOne").mockImplementation(() =>
			createQueryChain({
				_id: "course-1",
				courseName: "Contract Testing",
				instructor: { firstName: "Ada", lastName: "Lovelace" },
				courseContent: [],
				sections: [],
				ratingAndReviews: [],
			})
		);

		const response = await request(app)
			.post("/api/v1/course/getCourseDetails")
			.send({ courseId: "course-1" });

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.statusCode).toBe(200);
		expect(response.body.data.course).toBeTruthy();
		expect(response.body.data.course._id).toBe("course-1");
		expect(response.body.data.course.courseName).toBe("Contract Testing");
	});

	it("POST /api/v1/course/getCourseDetails requires courseId", async () => {
		const response = await request(app)
			.post("/api/v1/course/getCourseDetails")
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(400);
	});

	it("POST /api/v1/course/getCourseDetails returns 404 when course is missing", async () => {
		jest.spyOn(Course, "findOne").mockImplementation(() => createQueryChain(null));

		const response = await request(app)
			.post("/api/v1/course/getCourseDetails")
			.send({ courseId: "course-404" });

		expect(response.status).toBe(404);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(404);
	});
});
