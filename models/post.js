const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
  content: {
      type: String,
      minlength: 100, // 한글 50자
      maxlength: 400 // 한글 200자
  }, 
  writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' //
  },
  time: {
      type: Date,
      default: Date.now
  },
  thumbs_up: {
      type: Number
  },
  thumbs_down: {
      type: Number
  }
});

const Post = mongoose.model('Post', postSchema);

exports.postSchema = postSchema;
exports.Post = Post; 