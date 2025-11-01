const Category = require("../models/Category");

//Create Category handler function
exports.createCategory = async (req, res) => {
    try {
        //fetch data from req body
        const { name, description } = req.body;

        //validation
        if(!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        //create entry in db
        const CategoryDetails = await Category.create({
            name: name,
            description: description,
        });

        console.log(CategoryDetails);

        //return response
        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.showAllCategories = async (req, res) => {
    try {
        const allCategory = await Category.find({}, {name: true, description: true});

        res.status(200).json({
            success: true,
            message: 'All Category returned successfully',
            data: allCategory,
        });
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body; // client se aayi category id

        // Get courses for the specified category -> category doc lao + uske courses populate karo
        const selectedCategory = await Category.findById(categoryId)
        .populate("Courses")
        .exec();

        console.log(selectedCategory);

        if (!selectedCategory) {
        console.log("Category not found.");
        return res
            .status(404)
            .json({ success: false, message: "Category not found" });
        }

        // Handle the case when there are no courses
        if (selectedCategory.course.length === 0) {
        console.log("No courses found for the selected category.");
        return res.status(404).json({
            success: false,
            message: "No courses found for the selected category.",
        });
        }

        // selected category ke courses
        const selectedCourses = selectedCategory.course;

        // Get courses for other categories -> current category ke alawa sab categories
        const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
        }).populate("courses");

        // in categories ke saare courses ko ek array me jod lo
        let differentCourses = [];
        for (const category of categoriesExceptSelected) {
        differentCourses.push(...category.course);
        }

        // Get top-selling courses across all categories
        const allCategories = await Category.find().populate("Courses");
        const allCourses = allCategories.flatMap((category) => category.course);
        const mostSellingCourses = allCourses; // yahan par sorting/metric add kar sakte ho

        // final response with 3 sections
        return res.status(200).json({
        success: true,
        data: {
            selectedCourses,
            differentCourses,
            mostSellingCourses,
        },
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}