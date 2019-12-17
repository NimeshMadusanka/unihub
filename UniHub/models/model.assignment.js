const mongoose = require('mongoose');

const AssignmentSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    course: {
        type: String,
        required: true
    },

    addedDate: {
        type: Date,
        default: Date.now()
    },

    deadline: {
        type: Date,
        required: true
    },

    attachment: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model('Assignment', AssignmentSchema);