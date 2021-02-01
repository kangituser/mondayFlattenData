const { Model, INTEGER, STRING } = require('sequelize');
const options = require('../options')('Relation');

class Relation extends Model {}

Relation.init({
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  parentId: {
      type: STRING,
      allowNull: true
    },
  childId: {
      type: STRING,
      allowNull: true
    }
}, options);

module.exports = Relation;