const { Model, INTEGER, STRING } = require('sequelize');
const sequelize = require('../connect');

class Dates extends Model {}

Dates.init({
    DATE: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
    },
    EladZribi: {
      type: INTEGER,
      allowNull: true,
    },
    YehonatanAfraimov: {
      type: INTEGER,
      allowNull: true,
    },
    JonathanAtia: {
      type: INTEGER,
      allowNull: true,
    },
    ShabiUziel: {
      type: INTEGER,
      allowNull: true,
    },
    noaat: {
      type: INTEGER,
      allowNull: true,
    },
    shilo: {
      type: INTEGER,
      allowNull: true,
    },
    robib: {
      type: INTEGER,
      allowNull: true,
    },
    simaEdry: {
      type: INTEGER,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'date',
    timestamps: false,
    freezeTableName: true,
  });

  Dates.sync();

module.exports = Dates;
