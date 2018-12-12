const { Post } = require('../models/post');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const posts = await Post
    .find()
    .populate('writer') // ???
    .sort([['_id', 1]]);
  res.send(posts);
});

router.post('/', async (req, res) => { // add authentication middleware 
  // const { error } = validate(req.body); 
  // if (error) return res.status(400).send(error.details[0].message);

  let post = new Post({ 
    content: req.body.content,
    writer: req.body.id // ???
  });
  post = await post.save();
  
  res.send(post);
})


module.exports = router;