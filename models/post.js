module.exports = (sequelize, DataTypes) => {
  return sequelize.define('post', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [250, 500],
          msg: '최소 250자 이상, 최대 500자 이하로 작성 가능합니다.'
        }
      }
    },
    postedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('now()')
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
  }, { 
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
   });
};