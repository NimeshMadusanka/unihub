const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  telephone: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('Student', StudentSchema);