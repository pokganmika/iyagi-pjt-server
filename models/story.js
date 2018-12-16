module.exports = (sequelize, DataTypes) => {
  var Story = sequelize.define('story', {
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isDone: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });

  return Story;
};