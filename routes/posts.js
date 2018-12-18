const db = require('../models');
const express = require('express');
const router = express.Router();
const { loggedin } = require('./middlewares');

// 연재 게시물 리스트
router.get('/', async (req, res, next) => {
  try {
    const ongoingStories = await db.Story.findAll({
      where: { isDone: false },
      attributes: { 
        include: [ 'id', 'views' ], 
        exclude: [ 'isDone', 'createdAt' ] 
      },
      include: [{ 
        model: db.Post,
        required: true,
        attributes: { 
          include: [ 'id', 'content' ], 
          exclude: [ 'userId', 'postedAt', 'thumbsUp', 'thumbsDown', 'storyId' ] 
        },
        include: [{
          model: db.User,
          required: true,
          attributes: { 
            include: [ 'id', 'thumbnail' ], 
            exclude: [ 'password', 'email', 'createdAt' ] 
          }
        }]
      }]
    });

    if (ongoingStories.length === 0) {
      return res.status(404).json({
        errorCode: "Not found",
        message: "연재 중인 게시물이 없습니다."
      });
    }
    res.json(ongoingStories);

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 새로운 게시물(story) 추가
router.post('/', async (req, res, next) => {
  try {
    const newStory = await db.Story.create({ isDone: false });
    return res.status(201).json({
      id: newStory.dataValues.id,
      message: "해당 id값으로 신규 게시물(story)이 저장되었습니다."
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 단일 연재물 클릭
router.get('/:id', async (req, res, next) => {
  const clickedStoryId = req.params.id;

  try {
    const story = await db.Story.findOne({
      where: { id: clickedStoryId, isDone: false },
      attributes: { 
        include: [ 'id', 'views' ], 
        exclude: [ 'isDone', 'createdAt' ] 
      },
      include: [{ 
        model: db.Post,
        required: true,
        attributes: { 
          include: [ 'id', 'content', 'postedAt', 'thumbsUp', 'thumbsDown' ], 
          exclude: [ 'userId', 'storyId' ] 
        },
        include: [{
          model: db.User,
          required: true,
          attributes: { 
            include: [ 'id', 'thumbnail' ], 
            exclude: [ 'password', 'email', 'createdAt' ] 
          }
        }]
      }]
    });

    if (!story) {
      return res.status(404).json({
        errorCode: "Not found",
        message: "요청과 일치하는 게시물이 존재하지 않습니다."
      });
    }

    const updatedStory = await story.increment('views', { by: 1 });
    console.log('조회수', updatedStory.dataValues.views);
    
    return res.json(updatedStory); // *** 증가된 조회수 X !!!!!!! ***

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 연재글 작성
router.post('/:id', loggedin, async (req, res, next) => { 
  const storyId = req.params.id;
  const userId = req.user.id;
  const content = req.body.content;
    
  try {
    const results = await db.Post.findAll({ where: { storyId: storyId } });
    let alreadyWrote = [];
    results.forEach((result) => alreadyWrote.push(result.userId));
    if (alreadyWrote.includes(userId)) return res.json({
      errorCode: "Duplicate error",
      message: "이미 작성한 사용자입니다."
    });

    const newPost = await db.Post.create({
      userId, content, storyId
    });
    return res.status(201).json({
      id: newPost.dataValues.id,
      message: "해당 id값으로 신규 게시물(post)이 저장되었습니다."
    });
    
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 연재 게시물(a single resource) 추천, 비추천 버튼 클릭
router.patch('/:id/post/:num', async (req, res, next) => {  
  const postId = req.params.num;
  const thumbs = req.body.thumbs;
  
  try {
    const post = await db.Post.findByPk(postId)  
    if (!post) {
      return res.status(404).json({
        errorCode: "Not found",
        message: "요청한 게시물이 존재하지 않습니다."
      });
    }

    if (thumbs === 'up') {
      const updatedPost = await post.increment('thumbsUp', { by: 1 });
      res.json({
        id: updatedPost.id,
        message: `해당 id의 게시물 내용이 수정되었습니다. (추천수: ${updatedPost.thumbsUp + 1})`
      });
    } else if (thumbs === 'down') {
      const updatedPost = await post.increment('thumbsDown', { by: 1 });
      res.json({
        id: updatedPost.id,
        message: `해당 id의 게시물 내용이 수정되었습니다. (비추천수: ${updatedPost.thumbsDown + 1})`
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 미리보기 화면에서 완결 버튼 클릭
router.patch('/:id', async (req, res, next) => {
  const storyId = req.params.id;

  try {
    if (req.body.isDone === true) {
      const story = await db.Story.findByPk(storyId);
      if (!story) {
        return res.status(404).json({
          errorCode: "Not found",
          message: "요청한 연재 게시물이 없습니다."
        });
      }
      
      const doneStory = await story.update({ isDone: true });
      res.json({
        id: doneStory.id,
        message: "해당 id의 연재 게시물이 완결 처리 되었습니다."
      });
    } else {
      res.status(400).json({
        errorCode: "Invalid request",
        message: "해당 요청을 처리할 수 없습니다."
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

module.exports = router;