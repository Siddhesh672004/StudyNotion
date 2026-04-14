const Category = require("../../server/src/models/Category");
const Course = require("../../server/src/models/Course");
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../../server/src/controllers/Category");

const createResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createQueryChain = (result) => {
  const chain = {
    populate() {
      return chain;
    },
    lean: jest.fn().mockResolvedValue(result),
  };

  return chain;
};

describe("Category controller", () => {
  it("createCategory creates a category with standardized response", async () => {
    const req = {
      body: {
        name: "Development",
        description: "Development courses",
      },
    };
    const res = createResponse();
    const next = jest.fn();

    jest.spyOn(Category, "create").mockResolvedValue({
      _id: "cat-1",
      name: "Development",
      description: "Development courses",
    });

    await createCategory(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        statusCode: 201,
      })
    );
  });

  it("createCategory validates required fields", async () => {
    const req = { body: { name: "" } };
    const res = createResponse();
    const next = jest.fn();

    await createCategory(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
      })
    );
  });

  it("showAllCategories returns categories envelope", async () => {
    const req = {};
    const res = createResponse();
    const next = jest.fn();

    jest.spyOn(Category, "find").mockImplementation(() =>
      createQueryChain([{ _id: "cat-1", name: "Development", description: "Desc" }])
    );

    await showAllCategories(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        statusCode: 200,
        data: expect.objectContaining({
          categories: expect.any(Array),
        }),
      })
    );
  });

  it("categoryPageDetails returns selected, different and topSelling payload", async () => {
    const req = {
      body: { categoryId: "cat-main" },
      query: {},
    };
    const res = createResponse();
    const next = jest.fn();

    const selectedCategory = {
      _id: "cat-main",
      courses: [{ _id: "course-a", instructor: { firstName: "A" } }],
    };
    const differentCategory = {
      _id: "cat-other",
      courses: [{ _id: "course-b", instructor: { firstName: "B" } }],
    };

    jest.spyOn(Category, "findById").mockImplementation((id) => {
      if (String(id) === "cat-main") {
        return createQueryChain(selectedCategory);
      }
      return createQueryChain(differentCategory);
    });

    jest.spyOn(Category, "aggregate").mockResolvedValue([{ _id: "cat-other" }]);

    jest.spyOn(Course, "find").mockImplementation(() =>
      createQueryChain([
        { _id: "course-a", studentsEnrolled: ["u1"] },
        { _id: "course-b", studentsEnrolled: ["u1", "u2", "u3"] },
      ])
    );

    await categoryPageDetails(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        statusCode: 200,
        data: expect.objectContaining({
          selectedCategory: expect.objectContaining({ _id: "cat-main" }),
          differentCategory: expect.objectContaining({ _id: "cat-other" }),
          topSelling: expect.arrayContaining([
            expect.objectContaining({ _id: "course-b" }),
          ]),
        }),
      })
    );
  });
});
