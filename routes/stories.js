var db = require('../models');
var mysql = require('mysql2/promise');
var express = require('express');
var router = express.Router();

// 완결 게시물 리스트
router.get('/', async (req, res) => {
  var getDoneStories = `
    SELECT s.storyId, s.views, p.postId, p.content, u.userId, u.thumbnail
    FROM stories s INNER JOIN posts p ON s.storyId = p.storyId INNER JOIN users u ON p.userId = u.userId
    WHERE s.isDone = true
  `;
  
  await db.conn.execute(getDoneStories, (err, results) => {
    if (results.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "완결된 게시물이 존재하지 않습니다."
      });
    }

    res.send(results);
  })
});

// 단일 게시물 클릭
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

// 댓글 리스트
router.get('/:id/comments', async (req, res) => {
  var clickedStory = req.params.id;
  
  var sql = `SELECT * FROM comments WHERE storyId = ${clickedStory}`;

  await db.conn.execute(sql, (err, results) => {
    if (results.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "해당 게시물이 존재하지 않습니다."
      });
    }

    res.send(results);
  })
});

// 댓글 작성
router.post('/:id/comments', async (req, res) => {
  var clickedStory = req.params.id;
  var userId = req.body.userId;
  var content = req.body.content;

  var sql = `SELECT * FROM stories WHERE storyId = ${clickedStory}`;

  await db.conn.execute(sql, async (err, results) => {
    if (results.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "해당 게시물이 존재하지 않습니다."
      });
    }

    var insertComment = `
      INSERT INTO comments(userId, content, storyId) 
      VALUES('${userId}', '${content}', ${clickedStory})
    `;
    
    await db.conn.execute(insertComment, (err, result) => {
      if (err) console.err;
      res.send({ 
        id: result.insertId,
        message: "해당 id의 게시물이 저장되었습니다."
       });
    });
  });
});

// 댓글 수정
router.patch('/:id/comments/:num', async (req, res) => {
  var updatedComment = req.params.num; // commentId
  var updatedContent = req.body.content;

  var sql = `SELECT * FROM comments WHERE commentId = ${updatedComment}`;

  await db.conn.execute(sql, async (err, results) => {
    if (results.length === 0) {
      return res.status(404).send({
        errorCode: "Not Found",
        message: "해당 댓글이 존재하지 않습니다."
      });
    }
  
    var updateComment = `
      UPDATE comments SET content = '${updatedContent}'
      WHERE commentId = ${updatedComment}
    `;
    
    await db.conn.execute(updateComment, (err, results) => {
      if (err) console.err;
      res.send({
        id: updatedComment,
        message: "해당 댓글의 내용이 수정되었습니다."
      });
    });
  });
});

module.exports = router;