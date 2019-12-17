const mongoose = require('mongoose');

const SolutionSchema = mongoose.Schema({

    student: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    marks: {
        type: Number
    },

    submitDate: {
        type: Date,
        default: Date.now()
    },

    assignment: {
        type: String,
        required: true
    },

    attachment: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Solution", SolutionSchema);