const Dates = require('../db/models/date');

const updateDateTable = async ({ personInCharge, plannedWorkTimeStart }) => {
  try {
    return await Dates.update({ [personInCharge]: 1 }, { where: { DATE: plannedWorkTimeStart }})
  } catch (err) {
    console.log(err);
  }
}

module.exports = updateDateTable;