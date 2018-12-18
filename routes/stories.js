const db = require('../models');
const express = require('express');
const router = express.Router();

// 완결 게시물 리스트
router.get('/', async (req, res, next) => {
  try {
    const doneStories = await db.Story.findAll({
      where: { isDone: true },
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

    if (doneStories.length === 0) {
      return res.status(404).json({
        errorCode: "Not found",
        message: "완결된 게시물이 없습니다."
      });
    }
    res.json(doneStories);

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 단일 완결물 클릭 -> 조회수 증가
router.patch('/:id', async (req, res, next) => {
  const clickedStoryId = req.params.id;

  try {
    const story = await db.Story.findByPk(clickedStoryId);

    if (!story) {
      return res.status(404).json({
        errorCode: "Not found",
        message: "요청과 일치하는 게시물이 존재하지 않습니다."
      });
    }

    const updatedStory = await story.increment('views');
    
    return res.json({
      id: updatedStory.id,
      message: `해당 id의 게시물 조회수가 +1 증가하였습니다. (${updatedStory.views + 1})`
    });

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 단일 완결물 출력
router.get('/:id', async (req, res, next) => {
  const clickedStoryId = req.params.id;

  try {
    const story = await db.Story.findOne({
      where: { id: clickedStoryId, isDone: true },
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

    if (!story) {
      return res.status(404).json({
        errorCode: "Not found",
        message: "요청과 일치하는 게시물이 존재하지 않습니다."
      });
    }

    return res.json(story);

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 댓글 리스트
router.get('/:id/comments', async (req, res, next) => {
  const clickedStoryId = req.params.id;

  try {
    const comments = await db.Comment.findAll({
      where: { storyId: clickedStoryId }
    });

    if (!comments) {
      return res.status(404).json({
        errorCode: "Not Found",
        message: "해당 게시물의 댓글이 존재하지 않습니다."
      });
    }

    return res.json(comments);

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 댓글 작성
router.post('/:id/comments', async (req, res, next) => {
  const storyId = req.params.id;
  const username = req.body.username;
  const content = req.body.content;

  try {
    const newComment = await db.Comment.create({
      username, content, storyId
    });
    return res.status(201).json({
      id: newComment.dataValues.id,
      message: "해당 id값으로 신규 댓글이 저장되었습니다."
    });
    
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

// 댓글 수정
router.patch('/:id/comments/:num', async (req, res) => {
  const commentId = req.params.num;
  const content = req.body.content;

  try { 
    const comment = await db.Comment.findByPk(commentId);  
    if (!comment) {
      return res.status(404).json({
        errorCode: "Not Found",
        message: "해당 댓글이 존재하지 않습니다."
      });
    }
    
    const updatedComment = await comment.update({ content });
    res.json({
      id: updatedComment.id,
      message: "해당 id의 댓글 내용이 수정되었습니다."
    });
    
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

module.exports = router;