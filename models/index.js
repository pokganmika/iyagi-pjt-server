var path = require('path');
var Sequelize = require('sequelize');

var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database successfully!');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.User = require('./user')(sequelize, Sequelize);
db.Story = require('./story')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

db.User.hasMany(db.Post, { foreignKey: 'username', sourceKey: 'username' });
db.Post.belongsTo(db.User, {
  foreignKey: 'username', 
  targetKey: 'username',
  onDelete: 'NO ACTION' // 적용 X !!!!!
});
db.Story.hasMany(db.Post, { foreignKey: 'storyId', sourceKey: 'id' });
db.Post.belongsTo(db.Story, { foreignKey: 'storyId', targetKey: 'id' });
db.Story.hasMany(db.Comment, { foreignKey: 'storyId', sourceKey: 'id' });
db.Comment.belongsTo(db.Story, { foreignKey: 'storyId', targetKey: 'id' });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

