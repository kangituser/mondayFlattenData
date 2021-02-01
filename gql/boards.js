const instance = require('../services/axios');

const boards = `query {
  boards {
    id
    name
    board_folder_id
  }
}`

const getBoards = async () => {
  try {
    return await instance.post('', { query: boards });
  } catch (err) {
    throw err;
  }
}

module.exports = getBoards;