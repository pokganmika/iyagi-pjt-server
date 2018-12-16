module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: { msg: 'Invalid email.' }
      }
    },
    thumbnail: { type: DataTypes.STRING },
  });

  return User;
};