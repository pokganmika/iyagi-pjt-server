const { Post } = require('../models/post');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// 연재 중인 posts 전부 fetch
router.get('/', async (req, res) => {
  const ongoingStory = await Story.find({ isDone: false });
  if (!ongoingStory)return res.status(404).send('The ongoing story was not found.');
  
  res.send(ongoingStory.posts); // Array
  // post.content ----> .sort([['_id', 1]])
  // post.writer.name ---> .populate('writer', 'name thumbnail')
  // post.writer.thumbnail
  // post.thumbs_up
  // post.thumbs_down

  // const posts = await Post
  //   .find()
  //   .populate('writer') // ???
  //   .sort([['_id', 1]]);
  // res.send(posts);
});

// 연재 글 작성 (로그인한 유저)
router.post('/', async (req, res) => { // add authentication middleware 
  // ** user input validation check **
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  let post = new Post({ 
    content: req.body.content,
    writer: req.body.id // ???
  });
  post = await post.save();

  const ongoingStory = await Story.find({ isDone: false });
  if (!ongoingStory) {
    const story = new Story({
      posts: [ post ],
      isDone: false
    })
  }
  else {
    ongoingStory.posts.push(post);
  }

  res.send(post);
})

// 연재 post 미리보기 (route)
router.get('/:preview', async (req, res) => {
  const ongoingStory = await Story.find({ isDone: false });
  if (!ongoingStory)return res.status(404).send('The ongoing story was not found.');

  const content = "";
  ongoingStory.posts.forEach(post => content += post.content);

  res.send(content); // String
});

// '완결' 버튼 클릭
router.post('/:preview', async (req, res) => {
  const result = await Story.update({ isDone: false }, {
    $set: {
      isPublished: true
    }
  });
  
  res.send(result);
});

module.exports = router;
