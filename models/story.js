const mongoose = require('mongoose');
const { Schema } = mongoose;
const { postSchema } = require('./post');
const { commentSchema } = require('./comment');

const storySchema = new Schema({
  posts: [ postSchema ],
  comments: [ commentSchema ],
  views: {
    type: Number,
    default: 0 // findByIdAndUpdate({ $inc: { views: 1} })
  },
  isDone: Boolean // 완결 여부
});

const Story = mongoose.model('Story', storySchema);

exports.storySchema = storySchema;
exports.Story = Story; 
