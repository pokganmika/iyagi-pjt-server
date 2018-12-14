var db = require('../models');
var mysql = require('mysql2/promise');
var express = require('express');
var router = express.Router();

// 연재 게시물
router.get('/', async (req, res) => {
  var sql = `
    SELECT u.userId, u.thumbnail, p.postId, p.content, p.postedAt, p.thumbsUp, p.thumbsDown
    FROM users u INNER JOIN posts p
    ON u.userId = p.userId
    WHERE p.storyId = (SELECT storyId FROM stories WHERE isDone = false);`;

  await db.conn.execute(sql, (err, results) => {
    if (err) console.err;
    res.send(results);
  });
});

// 연재글 작성
router.post('/', async (req, res) => { // add authentication middleware
  var userId = req.body.writer; // 로그인한 사용자의 아이디
  var content = req.body.content;
  console.log('userId: ' + userId + ', content: ' + content);

  var sql = `SELECT storyId FROM stories WHERE isDone = false`;
  
  var ongoingStoryId = 0;
  await db.conn.execute(sql, async (err, result) => {
    if (err) console.err;
    console.log(result.length);
    if(result.length === 0) {
      var insertStory = `INSERT INTO stories(isDone) VALUES(false);`;
      await db.conn.execute(insertStory, async (err) => {
        if (err) console.err;
        ongoingStoryId = await db.conn.execute(sql);
        console.log('new story saved', ongoingStoryId);
      })
    } else {
      ongoingStoryId = result[0].storyId;
      console.log(ongoingStoryId);
    }

    var insertPost = `
      INSERT INTO posts(userId, content, storyId) 
      VALUES('${userId}', '${content}', ${ongoingStoryId})`;

    await db.conn.execute(insertPost, (err) => {
      if (err) console.err;
      // foreign key가 맞지 않는 경우 저장 X -> 에러 처리
      res.send('new post saved!');
    });
  });
});

// 미리보기 화면에서 완결 버튼 클릭
router.patch('/', async (req, res) => {
  var sql = `SELECT storyId FROM stories WHERE isDone = false`;

  var ongoingStoryId = 0;
  await db.conn.execute(sql, async (err, result) => {
    if (err) console.err;
    ongoingStoryId = result[0].storyId;
    console.log(ongoingStoryId);

    var updateStory = `UPDATE stories SET isDone = true WHERE storyId = ${ongoingStoryId}`;

    await db.conn.execute(updateStory, (err) => {
      if (err) console.err;
      res.send('story closed!');
    })
  });

});

module.exports = router;