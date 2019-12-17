const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({

    user: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    }

});

module.exports = mongoose.model("Notification", NotificationSchema);