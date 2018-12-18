module.exports = (sequelize, DataTypes) => {
  return sequelize.define('comment', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    postedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('now()')
    },
    storyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, { 
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
};