const mongoose = require('mongoose');
const { Schema } = mongoose;

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

exports.postSchema = postSchema;
exports.Post = Post; 