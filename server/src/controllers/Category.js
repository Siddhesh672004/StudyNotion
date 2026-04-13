const Category = require("../models/Category");
const Course = require("../models/Course");
const { ApiResponse } = require("../utils/apiResponse");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

//Create Category handler function
exports.createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        throw new AppError(400, "All fields are required");
    }

    const category = await Category.create({
        name,
        description,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, { category }, "Category created successfully"));
});

// Navbar categories endpoint
exports.showAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}, "name description")
        .populate({
            path: "courses",
            match: { status: "Published" },
            select: "_id",
        })
        .lean();

    return res
        .status(200)
        .json(new ApiResponse(200, { categories }, "All categories returned successfully"));
});

exports.categoryPageDetails = asyncHandler(async (req, res) => {
    const categoryId = req.query.categoryId || req.body.categoryId;

    if (!categoryId) {
        throw new AppError(400, "categoryId is required");
    }

    const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "courses",
            match: { status: "Published" },
            populate: { path: "instructor", select: "firstName lastName email image" },
        })
        .lean();

    if (!selectedCategory) {
        throw new AppError(404, "Category not found");
    }

    const differentCategoryDocs = await Category.aggregate([
        { $match: { _id: { $ne: selectedCategory._id } } },
        { $sample: { size: 1 } },
    ]);

    let differentCategory = null;
    if (differentCategoryDocs.length > 0) {
        differentCategory = await Category.findById(differentCategoryDocs[0]._id)
            .populate({
                path: "courses",
                match: { status: "Published" },
                populate: { path: "instructor", select: "firstName lastName email image" },
            })
            .lean();
    }

    const allPublishedCourses = await Course.find({ status: "Published" })
        .populate("instructor", "firstName lastName email image")
        .lean();

    const topSelling = allPublishedCourses
        .sort(
            (a, b) =>
                (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0)
        )
        .slice(0, 10);

    return res.status(200).json(
        new ApiResponse(200, {
            selectedCategory,
            differentCategory,
            topSelling,
            // Kept for backward compatibility with existing Catalog page usage.
            mostSellingCourses: topSelling,
        })
    );
});