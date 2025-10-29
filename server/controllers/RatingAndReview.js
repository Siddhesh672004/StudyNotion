const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//createRating
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;

        // fetch data from req body
        const { rating, review, courseId } = req.body;

        // check if user is enrolled or not -> sirf enrolled students review de sakte hain
        const courseDetails = await Course.findOne(
        {
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }, // array me userId present hona chahiye
        }
        );

        if (!courseDetails) {
        return res.status(404).json({
            success: false,
            message: "Student is not enrolled in the course",
        });
        }

        // check if user already reviewed the course -> ek user ek hi review de sakta hai
        const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId,
        });

        if (alreadyReviewed) {
        return res.status(403).json({
            success: false,
            message: "Course is already reviewed by the user",
        });
        }

        // create rating and review -> naya document banao
        const ratingReview = await RatingAndReview.create({
        rating,
        review,
        course: courseId,
        user: userId,
        });

        // update course with this rating/review -> course doc me reference push karo
        const updatedCourseDetails = await Course.findByIdAndUpdate(
        { _id: courseId },
        {
            $push: {
            ratingAndReviews: ratingReview._id,
            },
        },
        { new: true }
        );

        console.log(updatedCourseDetails);

        // return response -> success with created review
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingReview,
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

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        // get course ID 
        const courseId = req.body.courseId;

        // calculate avg rating 
        const result = await RatingAndReview.aggregate([
        {
            $match: {
            course: new mongoose.Types.ObjectId(courseId), // sirf is course ke reviews
            },
        },
        {
            $group: {
            _id: null,                         // single group banaya
            averageRating: { $avg: "$rating" },// saare ratings ka average
            },
        },
        ]);

        if (result.length > 0) {
        return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating,
        });
        }

        // if no rating/Review exist -> default 0
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0, no ratings given till now",
            averageRating: 0,
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

//getAllRating
exports.getAllRating = async (req, res) => { 
    try {
        // saare reviews nikaal lo, highest rating pehle (desc)
        const allReviews = await RatingAndReview.find({})
        .sort({ rating: "desc" })
        .populate({
            path: "user",                                // kis user ne diya
            select: "firstName lastName email image",    // sirf yeh fields chahiye
        })
        .populate({
            path: "course",                              // kis course ka review hai
            select: "courseName",                        // course ka naam show karo
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}