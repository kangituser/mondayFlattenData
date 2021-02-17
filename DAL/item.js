const Monday_Table = require("../db/models/Monday_Project");

const creatItems = async items => {
  try {
    await Monday_Table.destroy({ truncate: true, cascade: false });

    const created = await Monday_Table.bulkCreate(items);
  } catch (err) {
    console.log(err);
  }
}

module.exports = creatItems;