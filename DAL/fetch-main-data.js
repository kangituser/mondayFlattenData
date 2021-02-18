const { Op } = require('sequelize');
const Monday_Table = require('../db/models/Monday_Project');

const fetchMainTableData = async () => {
  try {
    return await Monday_Table.findAll({
      raw: true,
      where: { plannedWorkTimeStart: { [Op.ne]: null }, personInCharge: { [Op.ne]: '' } },
      attributes: ['plannedWorkTimeStart', 'plannedWorkTimeEnd' ,'personInCharge']
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = fetchMainTableData;
