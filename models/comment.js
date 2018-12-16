module.exports = (sequelize, DataTypes) => {
  var Comment = sequelize.define('comment', {
    writer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        leg: {
          args: [0, 200],
          msg: '한글 기준 100자 이하로 작성 가능합니다.'
        }
      }
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  });

  return Comment;
};