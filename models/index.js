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

var conn = mysql.createConnection({
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
});

module.exports = {
  conn: conn
}

