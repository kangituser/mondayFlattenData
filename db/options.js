const sequelize = require('./connect');

module.exports = modelName => {
  return { sequelize, modelName, timestamps: false }
}