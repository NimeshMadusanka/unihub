const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true,
        unique: true
    },

    instructor: {
        type: JSON,
        required: true
    },

    students: {
        type: Array
    },

    status: {
        type: String,
        default: 'pending'
    }

});

module.exports = mongoose.model("Course", CourseSchema);