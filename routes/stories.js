var db = require('../models');
var mysql = require('mysql2/promise');
var express = require('express');
var router = express.Router();

// 완결 게시물 리스트
router.get('/', async (req, res) => {
  var sql = `
    SELECT s.storyId, s.views, p.postId, p.userId, p.content, p.thumbsUp, p.thumbsDown
    FROM stories s INNER JOIN posts p
    ON s.storyId = p.storyId
    WHERE s.isDone = true
    ORDER BY s.storyId, p.postId
  `; // ***** comment, user table join *****
  
  await db.conn.execute(sql, (err, results) => {
    if (err) console.err;
    res.send(results);
  });
});

// 단일 게시물 클릭
router.get('/:id', async (req, res) => {
  var clickedStory = req.params.id;

  var sql = `SELECT * FROM stories WHERE storyId = ${clickedStory}`;

  await db.conn.execute(sql, async (err, results) => {
    if (results.length === 0) {
      return res.status(404).send('ERROR: 해당 게시물이 존재하지 않습니다.');
    }

    var updateViews = `UPDATE stories SET views=views+1 WHERE storyId = ${clickedStory};`;
  
    await db.conn.execute(updateViews, async (err) => {
      if (err) console.err;
  
      var fetchStory = `
        SELECT s.storyId, s.views, p.postId, p.userId, p.content, p.thumbsUp, p.thumbsDown
        FROM stories s INNER JOIN posts p 
        ON s.storyId = p.storyId
        WHERE s.storyId = ${clickedStory}
      `; // ***** comment, user table join *****
  
      await db.conn.execute(fetchStory, async (err, result) => {
        res.send(result);
      });
    });
  })
});

// 댓글 작성
router.post('/:id', async (req, res) => {
  var clickedStory = req.params.id;
  // *** add user input validation ***
  var userId = req.body.userId;
  var content = req.body.content;

  var sql = `SELECT * FROM stories WHERE storyId = ${clickedStory}`;

  await db.conn.execute(sql, async (err, results) => {
    if (results.length === 0) {
      return res.status(404).send('ERROR: 해당 게시물이 존재하지 않습니다.');
    }

    var insertComment = `
      INSERT INTO comments(userId, content, storyId) 
      VALUES('${userId}', '${content}', ${clickedStory})
    `;
    
    await db.conn.execute(insertComment, (err) => {
      if (err) console.err;
      res.send('new comment saved!');
    });
  });
});

// 댓글 수정
router.patch('/comments/:id', async (req, res) => {
  var updatedComment = req.params.id; // commentId
  var updatedContent = req.body.content;

  var sql = `SELECT * FROM comments WHERE commentId = ${updatedComment}`;

  await db.conn.execute(sql, async (err, results) => {
    if (results.length === 0) {
      return res.status(404).send('ERROR: 해당 댓글이 존재하지 않습니다.');
    }
  
    var updateComment = `
      UPDATE comments SET content = '${updatedContent}'
      WHERE commentId = ${updatedComment}
    `;
    
    await db.conn.execute(updateComment, (err, results) => {
      if (err) console.err;
      res.send('comments updated!');
    });
  });
});

module.exports = router;