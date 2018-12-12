// const Joi = require('joi'); // npm i joi
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { User, userSchema } = require('./user');

const postSchema = new Schema({
  content: {
      type: String,
      required: true,
      minlength: 100, // 한글 50자
      maxlength: 400 // 한글 200자
  }, 
  writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //
      required: true
  },
  time: {
      type: Date,
      default: Date.now,
  },
  thumbs_up: {
      type: Number,
      default: 0
  },
  thumbs_down: {
      type: Number,
      default: 0
  }
});

const Post = mongoose.model('Post', postSchema);

// function validateGenre(genre) {
//     const schema = {
//       name: Joi.string().min(3).required()
//     };
  
//     return Joi.validate(genre, schema);
// }


exports.postSchema = postSchema;
exports.Post = Post; 
