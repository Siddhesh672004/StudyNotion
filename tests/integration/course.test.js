const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../../server/src/app");
const Course = require("../../server/src/models/Course");
const CourseProgress = require("../../server/src/models/CourseProgress");

const createQueryChain = (result) => {
	const chain = {
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

const createExecChain = (result) => {
	const chain = {
		populate() {
			return chain;
		},
		exec: async () => result,
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

	it("GET /api/v1/course/showAllCourses queries only published courses", async () => {
		jest.spyOn(Course, "find").mockImplementation(() =>
			createExecChain([
				{
					_id: "course-1",
					courseName: "Published Course",
					price: 999,
					instructor: { firstName: "Ada", lastName: "Lovelace" },
					ratingAndReviews: [],
					studentsEnrolled: [],
				},
			])
		);

		const response = await request(app).get("/api/v1/course/showAllCourses");

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(Course.find).toHaveBeenCalledWith(
			{ status: "Published" },
			expect.objectContaining({
				courseName: true,
				price: true,
			})
		);
	});

	it("POST /api/v1/course/getFullCourseDetails rejects students not enrolled in course", async () => {
		jest.spyOn(Course, "findOne").mockImplementation(() =>
			createExecChain({
				_id: "course-1",
				courseName: "Locked Course",
				studentsEnrolled: [{ _id: "another-student" }],
				courseContent: [],
			})
		);
		jest.spyOn(CourseProgress, "findOne").mockResolvedValue(null);

		const response = await request(app)
			.post("/api/v1/course/getFullCourseDetails")
			.set("Authorization", `Bearer ${createStudentToken()}`)
			.send({ courseId: "course-1" });

		expect(response.status).toBe(403);
		expect(response.body.success).toBe(false);
	});
});
