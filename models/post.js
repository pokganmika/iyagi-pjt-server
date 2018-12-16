module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('post', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        leg: {
          args: [100, 400],
          msg: '한글 기준 50자 이상, 200자 이하로 작성 가능합니다.'
        }
      }
    },
    thumbsUp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    thumbsDown: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Post;
};