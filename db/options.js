const sequelize = require('./connect');

/** 
 * @description a generic helper to configure table models.
 */
module.exports = modelName => ({ sequelize, modelName, timestamps: false })