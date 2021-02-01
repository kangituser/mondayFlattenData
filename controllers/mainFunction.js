const { _main } = require('../services/mainFunction');

const mainFunction = async (req, res, next) => {
  try {
    const data = await _main();
    console.log(data);
  } catch (err) {
    throw err;
  }
}

module.exports = { mainFunction };