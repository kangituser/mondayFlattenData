const { INTEGER, STRING, TEXT, DATEONLY } = require('sequelize');

module.exports = {
  _pk: () => {
    return {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    }
  },
  _int: () => {
    return {
      type: INTEGER,
      allowNull: true
    }
  },
  _text: () => {
    return {
      type: TEXT,
      allowNull: true
    }
  },
  _date: () => {
    return {
      type: DATEONLY,
      allowNull: true
    }
  },
  _string: () => {
    return {
      type: STRING,
      allowNull: true
    }
  }
}