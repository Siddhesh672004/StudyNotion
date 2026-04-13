const test = require("node:test");
const assert = require("node:assert/strict");
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

test("POST /api/v1/course/getCategoryPageDetails returns catalog contract keys", async (t) => {
	const originalFindById = Category.findById;
	const originalAggregate = Category.aggregate;
	const originalCourseFind = Course.find;

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

	Category.findById = (id) => {
		if (String(id) === "cat-main") {
			return createQueryChain(selectedCategory);
		}
		return createQueryChain(differentCategory);
	};

	Category.aggregate = async () => [{ _id: "cat-other" }];

	Course.find = () => {
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
	};

	t.after(() => {
		Category.findById = originalFindById;
		Category.aggregate = originalAggregate;
		Course.find = originalCourseFind;
	});

	const response = await request(app)
		.post("/api/v1/course/getCategoryPageDetails")
		.send({ categoryId: "cat-main" });

	assert.equal(response.status, 200);
	assert.equal(response.body.success, true);
	assert.equal(response.body.data.selectedCategory._id, "cat-main");
	assert.equal(response.body.data.differentCategory._id, "cat-other");
	assert.equal(response.body.data.topSelling[0]._id, "course-b");
});
