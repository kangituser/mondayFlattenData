const { Model, INTEGER, STRING } = require('sequelize');
const options = require('../options')('Folder');

class Folder extends Model {}

Folder.init({
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  folder_name: {
    type: STRING,
    allowNull: true
  },
  folder_id: {
    type: INTEGER,
    allowNull: true
  }

  
}, options);

module.exports = Folder;