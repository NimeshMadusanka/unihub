const mongoose = require("mongoose");

const InstructorSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    telephone: {
        type: String
    },

    courses: {
        type: Array
    }

});

module.exports = mongoose.model("Instructor", InstructorSchema);