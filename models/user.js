const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024 
  },
  thumbnail: {
    data: Buffer,
    contentType: String
  }
});

const User = mongoose.model('User', userSchema);

exports.userSchema = userSchema;
exports.User = User; 