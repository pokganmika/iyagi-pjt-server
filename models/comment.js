const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
  content: {
      type: String,
      required: true,
      maxlength: 200
  },
  writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', //
      required: true
  },
  time: {
      type: Date,
      default: Date.now
  }
});

const Comment = mongoose.model('Comment', commentSchema);

exports.commentSchema = commentSchema;
exports.Comment = Comment; 