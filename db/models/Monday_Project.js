const { Model, INTEGER, STRING, TEXT } = require('sequelize');
const options = require('../options')('Monday_Table');
// const Relation = require('./Relation');

class Monday_Table extends Model {}

Monday_Table.init({
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  folderId: {
      type: STRING,
      allowNull: true
    },
  boardId: {
      type: STRING,
      allowNull: true
    },
  boardName: {
      type: STRING,
      allowNull: true
    },
  groupId: {
      type: STRING,
      allowNull: true
    },
  groupName: {
      type: STRING,
      allowNull: true
    },
  boardName: {
      type: STRING,
      allowNull: true
    },
  itemId: {
      type: STRING,
      allowNull: true
    },
  itemName: {
      type: STRING,
      allowNull: true
    },
  personInCharge: {
      type: STRING,
      allowNull: true
    },
  plannedWorkTimeStart: {
      type: STRING,
      allowNull: true
    },
  plannedWorkTimeEnd: {
      type: STRING,
      allowNull: true
    },
  deFactoWorkTimeStart: {
      type: STRING,
      allowNull: true
    },
  deFactoWorkTimeEnd: {
      type: STRING,
      allowNull: true
    },
  plannedWorkTimeGoal: {
      type: STRING,
      allowNull: true
    },
  deFactoWorkTimeGoal: {
      type: STRING,
      allowNull: true
    },
  status: {
      type: STRING,
      allowNull: true
    },
  deviation: {
    type: INTEGER,
    allowNull: true
  },
  comments: {
    type: TEXT,
    allowNull: true
  }
}, options);

// Monday_Table.hasMany(Relation, { sourceKey: 'item_id', foreignKey: 'parent_id', constraints: false });

module.exports = Monday_Table;