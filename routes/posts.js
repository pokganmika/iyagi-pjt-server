var db = require('../models');
var mysql = require('mysql2/promise');
var express = require('express');
var router = express.Router();

// 연재 게시물 리스트
router.get('/', async (req, res) => {
  var sql = `
    SELECT u.userId, u.thumbnail, p.postId, p.content, p.postedAt, p.thumbsUp, p.thumbsDown
    FROM users u INNER JOIN posts p
    ON u.userId = p.userId
    WHERE p.storyId = (SELECT storyId FROM stories WHERE isDone = false);`;

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

// 연재글 작성
router.post('/', async (req, res) => { // *** add authentication middleware ***
  var userId = req.body.userId; // 로그인한 사용자의 아이디 -> 세션 아이디
  var content = req.body.content; // 글자 수 제한 -> validation
 
  var getStoryId = `SELECT storyId FROM stories WHERE isDone = false`;
  
  var ongoingStoryId = 0;
  await db.conn.execute(getStoryId, async (err, result) => {
    if (err) console.err; 
    if (result.length === 0) {
      var insertStory = `INSERT INTO stories(isDone) VALUES(false);`;
      await db.conn.execute(insertStory, async (err) => {
        if (err) console.err;
        ongoingStoryId = await db.conn.execute(sql);
        console.log('new story saved: #', ongoingStoryId);
      })
    } else {
      ongoingStoryId = result[0].storyId;
      console.log('연재 게시물 ID: ', ongoingStoryId);
    }
    
    var checkUser = `SELECT userId FROM posts WHERE storyId = ${ongoingStoryId}`;
    await db.conn.execute(checkUser, async (err, results) => {
      var alreadyWrote = [];
      results.forEach((result) => alreadyWrote.push(result.userId));
      if (alreadyWrote.includes(userId)) return res.send({
        errorCode: "duplicate-error",
        message: "이미 작성한 사용자입니다."
      });
        
      var insertPost = `
        INSERT INTO posts(userId, content, storyId) 
        VALUES('${userId}', '${content}', ${ongoingStoryId})`;
  
      await db.conn.execute(insertPost, (err, result) => {
        if (err) console.err;
        res.status(201).send({ 
          id: result.insertId,
          message: "해당 id의 게시물이 저장되었습니다."
         });
      });
    });
  });
});

// 연재 게시물(a single resource) 추천, 비추천 버튼 클릭
router.patch('/:id', async (req, res) => {  
  var postId = req.params.id;
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
        messgae: "요청한 내용이 없습니다."
      });
    }
  });
});

// 미리보기 화면에서 완결 버튼 클릭
router.patch('/', async (req, res) => {
  if (req.body.isDone === true) {
    var sql = `SELECT storyId FROM stories WHERE isDone = false`;
  
    var ongoingStoryId = 0;
    await db.conn.execute(sql, async (err, result) => {
      if (err) console.err;
      if (result.length === 0) {
        return res.status(404).send({
          errorCode: "Not Found",
          message: "연재 중인 게시물이 없습니다."
        });
      }
      ongoingStoryId = result[0].storyId;
      console.log('완결 처리될 게시물 번호: ', ongoingStoryId);
  
      var updateStory = `UPDATE stories SET isDone = true WHERE storyId = ${ongoingStoryId}`;
  
      await db.conn.execute(updateStory, (err) => {
        if (err) console.err;
        res.send({
          id: ongoingStoryId,
          message: "해당 id의 게시물이 완결 처리 되었습니다."
        });
      })
    });
  }
});

module.exports = router;