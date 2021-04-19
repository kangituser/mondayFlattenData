const instance = require('../services/axios');

/**
 * @description GraphQL query to get all board ID's, Name's & Folder ID's.
 * The folder ID is the indication that a board is relevant (it is the filter parameter later on in the code).
 * 
 * @argument { limit: number } - upper limit threshold of query complexity. this is defined by Monday.com and can not go higher.
 * Note: Use Grapiql (not a typo) to test things out.
 */
const boards = `query {
  boards (limit: 500) {
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