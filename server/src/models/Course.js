const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        // Backward-compatible names used by existing frontend
        courseName: {
            type: String,
            required: true,
            trim: true,
        },
        courseDescription: {
            type: String,
            required: true,
        },

        // Normalized names for future-facing contracts
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        thumbnail: {
            type: String,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },

        // Existing and normalized section containers
        courseContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section",
            },
        ],
        sections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Section",
            },
        ],

        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        ratingAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "RatingAndReview",
            },
        ],

        // Missing fields identified in contract audit
        status: {
            type: String,
            enum: ["Draft", "Published"],
            default: "Draft",
        },
        instructions: [{ type: String }],
        whatYouWillLearn: {
            type: String,
        },
        tag: {
            type: [String],
            default: [],
        },
        language: {
            type: String,
            default: "English",
        },
    },
    { timestamps: true }
);

courseSchema.pre("save", function syncLegacyAndNormalized(next) {
    if (!this.title && this.courseName) {
        this.title = this.courseName;
    }
    if (!this.courseName && this.title) {
        this.courseName = this.title;
    }

    if (!this.description && this.courseDescription) {
        this.description = this.courseDescription;
    }
    if (!this.courseDescription && this.description) {
        this.courseDescription = this.description;
    }

    if (!this.sections?.length && this.courseContent?.length) {
        this.sections = this.courseContent;
    }
    if (!this.courseContent?.length && this.sections?.length) {
        this.courseContent = this.sections;
    }

    next();
});

module.exports = mongoose.model("Course", courseSchema);