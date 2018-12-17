module.exports = (sequelize, DataTypes) => {
  return sequelize.define('story', {
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('now()')
    }
  }, { timestamps: false });
};