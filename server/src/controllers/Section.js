const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;

        //data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }

        //create section
        const newSection = await Section.create({sectionName});

        //update section with section ObjectID
        //TODO: use populate to replace sections/sub-sections both in the updatedCourseDetails
        const updatedCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push: {
                                                    courseContent: newSection._id,
                                                }
                                            },
                                            {new: true},
                                        ).populate({
                                            path:"courseContent",                                            
                                            populate :{
                                                path:"subSection",                                                
                                            }
                                        }).exec();

       

        //return response
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        })
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Section, please try again",
            error: error.message,
        });
    }
}

exports.updateSection = async (req, res) => {
    try {
        //data input
        const {sectionName, sectionId} = req.body;

        //data validation
        if(!sectionName || !sectionId) {
        return res.status(400).json({
            success:false,
            message:'Missing Properties',
            });
        }

        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        //return res
        return res.status(200).json({
        success:true,
        message:'Section Updated Successfully',
        });

    }
    catch(err) {
        return res.status(500).json({
            success: false,
            message: "Unable to Update Section, please try again",
            error: err.message,
        });
    }
}

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body
        await Course.findByIdAndUpdate(courseId, {
            $pull: {
            courseContent: sectionId,
            },
        })
        const section = await Section.findById(sectionId)
        console.log(sectionId, courseId)
        if (!section) {
            return res.status(404).json({
            success: false,
            message: "Section not found",
            })
        }
        // Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: section.subSection } })
    
        await Section.findByIdAndDelete(sectionId)
    
        // find the updated course and return it
        const course = await Course.findById(courseId)
            .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
            })
            .exec()
    
        res.status(200).json({
            success: true,
            message: "Section deleted",
            data: course,
        })
        // //get ID - assuming that we are sending ID in params
        // const { sectionId } = req.body;

        // //use findByIdAndDelete
        // await Section.findByIdAndDelete(sectionId);

        // //return response
        // return res.status(200).json({
        // success: true,
        // message: "Section Deleted Successfully",
        // }); 
    }
    catch(error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete Section, please try again",
            error: error.message,
        });
    }
}


