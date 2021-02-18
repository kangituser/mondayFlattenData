const { Op, NOW } = require('sequelize');
const Dates = require('../db/models/date');

const updateDateTable = async ({
  personInCharge,
  plannedWorkTimeStart,
  plannedWorkTimeEnd,
}) => {
  try {
    // check if planned start <= today &&  planned end >= today
   
    return await Dates.update(
      { [personInCharge]: 1 },
      {
        where: {
          DATE: {
            [Op.gte]: plannedWorkTimeStart,
            [Op.lte]: plannedWorkTimeEnd,
            // [Op.gte]: new Date(plannedWorkTimeStart).toISOString().split('T')[0],
            // [Op.lte]: new Date(plannedWorkTimeEnd).toISOString().split('T')[0],
          },
        },
      }
    );
    // !row to zero all row/columns
    // return await Dates.update({ [personInCharge]: 0},{ where: { DATE: { [Op.ne]: null}}})
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateDateTable;
