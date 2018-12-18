const db = require('../models');
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    let doneStories = await db.Story.findAll({
      where: { isDone: true },
      attributes: { 
        include: [ 'id', 'views' ], 
        exclude: [ 'isDone', 'createdAt' ] 
      },
      include: [{ 
        model: db.Post,
        required: true,
        attributes: { 
          include: [ 'id', 'content', 'thumbsUp', 'thumbsDown' ], 
          exclude: [ 'userId', 'postedAt', 'storyId' ] 
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

    // 최다 조회수
    let maxViews = doneStories[0].views;
    let maxViewsObj = doneStories[0];
    for (let obj of doneStories) {
      if (obj.views > maxViews) {
        maxViews = obj.views; // 최다 조회수
        maxViewsObj = obj; // 베스트
      }
    }

    // 최다 추천 + 비추천수
    let thumbsArr = doneStories.map(obj => {
      return obj.posts.map(post => {
        return post.thumbsUp + post.thumbsDown;
      })
    })

    let sumArr = [];
    let sum = 0;
    for (let arr of thumbsArr) {
      for (let val of arr) {
        sum += val;
      }
      sumArr.push(sum);
      sum = 0;
    }
    
    let maxThumbs = Math.max(...sumArr); // 추천+비추천수
    let index = sumArr.indexOf(maxThumbs); // doneStories[index] // 이슈
    
    let result = {
      "bestStory": {
        "maxViews": maxViews,
        "posts": maxViewsObj.posts
      },
      "issueStory": {
        "maxThumbs": maxThumbs,
        "posts": doneStories[index].posts
      }
    }

    res.json(result);

  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorCode: e.errors[0].type,
      message: e.errors[0].message
    });
  }
});

module.exports = router;
