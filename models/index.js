const path = require('path');
var mysql = require('mysql2');
// const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// const sequelize = new Sequelize(config.database, config.username, config.password, config);

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

let conn = mysql.createConnection({
  host: 'localhost',
  user: config.username,
  password: config.password,
  database: config.database
});

conn.connect((err) => {
  if (err) {
    return console.error('error: ' + err.message);
  }
  console.log('Connected to MySQL server');

  let createUsers = `
  CREATE TABLE IF NOT EXISTS users(
    userId VARCHAR(30) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  conn.query(createUsers, (err, results, fields) => {
    if (err) {
      console.log(err.message);
    }
    console.log('created users table');
  });

  let createStories = `
  CREATE TABLE IF NOT EXISTS stories(
    storyId INT PRIMARY KEY AUTO_INCREMENT,
    views INT DEFAULT 0,
    isDone TINYINT(1) NOT NULL DEFAULT 0
  )`;

  conn.query(createStories, (err, results, fields) => {
    if (err) {
      console.log(err.message);
    }
    console.log('created stories table');
  });

  let createPosts = `
  CREATE TABLE IF NOT EXISTS posts(
    postId INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    postedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    thumbsUp INT DEFAULT 0,
    thumbsDown INT DEFAULT 0,
    storyId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (storyId) REFERENCES stories(storyId)
  )`;

  conn.query(createPosts, (err, results, fields) => {
    if (err) {
      console.log(err.message);
    }
    console.log('created posts table');

  });

  let createComments = `
  CREATE TABLE IF NOT EXISTS comments(
    commentId INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(30) NOT NULL,
    content TEXT NOT NULL,
    storyId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(userId),
    FOREIGN KEY (storyId) REFERENCES stories(storyId)
  )`;

  conn.query(createComments, (err, results, fields) => {
    if (err) {
      console.log(err.message);
    }
    console.log('created comments table');

  });

});

module.exports = {
  conn: conn
}

