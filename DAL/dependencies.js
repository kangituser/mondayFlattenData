const Relation = require("../db/models/Relation");

const cearteDependencies = async dependencies => {
  try {
    await Relation.destroy({ truncate: true, cascade: false });
    const created = await Relation.bulkCreate(dependencies);
  } catch (err) {
    console.log(err);
  }
}

module.exports = cearteDependencies