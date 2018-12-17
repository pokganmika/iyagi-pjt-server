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
  }, { timestamps: false });
};