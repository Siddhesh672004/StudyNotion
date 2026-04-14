const request = require("supertest");

const app = require("../../server/src/app");
const Category = require("../../server/src/models/Category");
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

describe("Catalog API contracts", () => {
	it("POST /api/v1/course/getCategoryPageDetails returns catalog contract keys", async () => {
		const selectedCategory = {
			_id: "cat-main",
			name: "Development",
			description: "Selected category",
			courses: [{ _id: "course-1", instructor: { firstName: "Alice" } }],
		};

		const differentCategory = {
			_id: "cat-other",
			name: "Design",
			description: "Different category",
			courses: [{ _id: "course-2", instructor: { firstName: "Bob" } }],
		};

		jest.spyOn(Category, "findById").mockImplementation((id) => {
			if (String(id) === "cat-main") {
				return createQueryChain(selectedCategory);
			}
			return createQueryChain(differentCategory);
		});

		jest.spyOn(Category, "aggregate").mockResolvedValue([{ _id: "cat-other" }]);

		jest.spyOn(Course, "find").mockImplementation(() => {
			const chain = {
				populate() {
					return chain;
				},
				lean: async () => [
					{ _id: "course-a", studentsEnrolled: ["u1"] },
					{ _id: "course-b", studentsEnrolled: ["u1", "u2", "u3"] },
				],
			};

			return chain;
		});

		const response = await request(app)
			.post("/api/v1/course/getCategoryPageDetails")
			.send({ categoryId: "cat-main" });

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.data.selectedCategory._id).toBe("cat-main");
		expect(response.body.data.differentCategory._id).toBe("cat-other");
		expect(response.body.data.topSelling[0]._id).toBe("course-b");
	});

	it("POST /api/v1/course/getCategoryPageDetails requires categoryId", async () => {
		const response = await request(app)
			.post("/api/v1/course/getCategoryPageDetails")
			.send({});

		expect(response.status).toBe(400);
		expect(response.body.success).toBe(false);
		expect(response.body.statusCode).toBe(400);
	});
});
