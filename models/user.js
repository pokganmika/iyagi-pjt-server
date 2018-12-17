module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
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
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('now()')
    }
  }, { timestamps: false });
};