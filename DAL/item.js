const Monday_Table = require("../db/models/Monday_Project");

const creatItems = async items => {
  try {
    console.log('Removing all data from table');
    await Monday_Table.destroy({ truncate: true, cascade: false });
    console.log('Done Removing all data from table');
    console.log('Re-Creating all data from board to database');
    const created = await Monday_Table.bulkCreate(items);
    console.log('Done Re-Creating all data from board to database');
  } catch (err) {
    console.log(err);
  }
}

module.exports = creatItems;