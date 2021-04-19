const { Op } = require('sequelize');
const Dates = require('../db/models/date');

const updateDateTable = async ({ personInCharge, plannedWorkTimeStart, plannedWorkTimeEnd }) => {
  try {
   if (personInCharge === 'Jonathan Atia') console.log(plannedWorkTimeStart, ' ', plannedWorkTimeEnd);
    return await Dates.update({ [personInCharge]: 1 }, {
        where: {
          DATE: {
            [Op.gte]: plannedWorkTimeStart,
            [Op.lte]: plannedWorkTimeEnd,
           
          },
        },
      }
    );
    // ! => code to reset all row/columns...
    // return await Dates.update({ [personInCharge]: 0},{ where: { DATE: { [Op.ne]: null}}})
  } catch (err) {
    console.log(err);
  }
};

module.exports = updateDateTable;
