var db = require('../models');
var mysql = require('mysql2/promise');
var express = require('express');
var router = express.Router();

// 연재 게시물 리스트
router.get('/', async (req, res) => {
  var sql = `
    SELECT s.storyId, s.views, p.postId, p.content, u.userId, u.thumbnail
    FROM stories s INNER JOIN posts p ON s.storyId = p.storyId INNER JOIN users u ON p.userId = u.userId
    WHERE s.isDone = false  
  `;

  await db.conn.execute(sql, (err, results) => {
    if (err) console.err;
    if (results.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "연재 중인 게시물이 없습니다."
      })
    }
    res.send(results);
  });
});

// 새로운 게시물(story) 추가
router.post('/', async (req, res) => {
  var sql = `INSERT INTO stories(isDone) VALUES(false)`;

  await db.conn.execute(sql, (err, result) => {
    if (err) console.err;
    res.status(201).send({
      id: result.insertId,
      message: "해당 id값으로 신규 게시물(story)이 저장되었습니다."
    })
  })
});

// 단일 연재 게시물 클릭
router.get('/:id', async (req, res) => {
  var clickedStory = req.params.id;

  var sql = `SELECT * FROM stories WHERE storyId = ${clickedStory}`;

  await db.conn.execute(sql, async (err, results) => {
    if (results.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "해당 게시물이 존재하지 않습니다."
      });
    }

    var updateViews = `UPDATE stories SET views=views+1 WHERE storyId = ${clickedStory};`;
  
    await db.conn.execute(updateViews, async (err) => {
      if (err) console.err;
  
      var getClickedStory = `
        SELECT s.storyId, s.views, p.postId, p.content, u.userId, u.thumbnail
        FROM stories s INNER JOIN posts p ON s.storyId = p.storyId INNER JOIN users u ON p.userId = u.userId
        WHERE s.storyId = ${clickedStory}
      `; 
  
      await db.conn.execute(getClickedStory, async (err, result) => {
        res.send(result);
      });
    });
  })
});

// 연재글 작성
router.post('/:id', async (req, res) => { // *** add authentication middleware ***
  var storyId = req.params.id;
  var userId = req.body.userId; // 로그인한 사용자의 아이디 -> ** session.id **
  var content = req.body.content; // *** 글자 수 제한 -> validation ***
    
  var checkUser = `SELECT userId FROM posts WHERE storyId = ${storyId}`;
  await db.conn.execute(checkUser, async (err, results) => {
    var alreadyWrote = [];
    results.forEach((result) => alreadyWrote.push(result.userId));
    if (alreadyWrote.includes(userId)) return res.send({
      errorCode: "duplicate-error",
      message: "이미 작성한 사용자입니다."
    });
      
    var insertPost = `
      INSERT INTO posts(userId, content, storyId) 
      VALUES('${userId}', '${content}', ${storyId})`;

    await db.conn.execute(insertPost, (err, result) => {
      if (err) console.err;
      res.status(201).send({ 
        id: result.insertId,
        message: "해당 id값으로 신규 게시물(post)이 저장되었습니다."
        });
    });
  });
  
});

// 연재 게시물(a single resource) 추천, 비추천 버튼 클릭
router.patch('/:id/post/:num', async (req, res) => {  
  var postId = req.params.num;
  var thumbs = req.body.thumbs;

  var sql = `SELECT * FROM posts WHERE postId = ${postId}`;

  await db.conn.execute(sql, async (err, result) => {
    if (err) console.err; 
    if (result.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "요청한 게시물이 존재하지 않습니다."
      });
    }
    
    if (thumbs === 'up') {
      var updateThumbsUp = `UPDATE posts SET thumbsUp=thumbsUp+1 WHERE postId = ${postId}`;
  
      await db.conn.execute(updateThumbsUp, (err) => {
        if (err) console.err;
        res.send({
          id: postId,
          message: "요청한 게시물이 수정되었습니다. (추천 +1)"
        });
      })
    }
    else if (thumbs === 'down') {
      var updateThumbsDown = `UPDATE posts SET thumbsDown=thumbsDown+1 WHERE postId = ${postId}`;
  
      await db.conn.execute(updateThumbsDown, (err, result) => {
        if (err) console.err;
        res.send({
          id: postId,
          message: "요청한 게시물이 수정되었습니다. (비추천 +1)"
        });
      })
    }
    else {
      res.send({
        errorCode: "Invalid Request",
        messgae: "요청한 내용을 처리할 수 없습니다."
      });
    }
  });
});

// 미리보기 화면에서 완결 버튼 클릭
router.patch('/:id', async (req, res) => {
  var storyId = req.params.id;

  if (req.body.isDone === true) {
    var sql = `SELECT * FROM stories WHERE storyId = ${storyId}`;
  
    await db.conn.execute(sql, async (err, result) => {
      if (err) console.err;
      if (result.length === 0) {
        return res.status(404).send({
          errorCode: "Not Found",
          message: "연재 중인 게시물이 없습니다."
        });
      }
  
      var updateStory = `UPDATE stories SET isDone = true WHERE storyId = ${storyId}`;
  
      await db.conn.execute(updateStory, (err) => {
        if (err) console.err;
        res.send({
          id: storyId,
          message: "해당 id의 연재 게시물이 완결 처리 되었습니다."
        });
      })
    });
  }
});

module.exports = router;