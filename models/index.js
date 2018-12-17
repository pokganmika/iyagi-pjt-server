const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = require('./user')(sequelize, Sequelize);
db.Story = require('./story')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

db.User.hasMany(db.Post, { foreignKey: 'userId', sourceKey: 'id' });
db.Post.belongsTo(db.User, {
  foreignKey: 'userId', 
  targetKey: 'id',
  onDelete: 'NO ACTION' // *** 적용 X !!!!! ***
});
db.Story.hasMany(db.Post, { foreignKey: 'storyId', sourceKey: 'id' });
db.Post.belongsTo(db.Story, { foreignKey: 'storyId', targetKey: 'id' });
db.Story.hasMany(db.Comment, { foreignKey: 'storyId', sourceKey: 'id' });
db.Comment.belongsTo(db.Story, { foreignKey: 'storyId', targetKey: 'id' });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

