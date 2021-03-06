const instance = require('../services/axios');

const item = boardId => {
  return `query {
  boards (ids: ${boardId}, limit: 100) { 
    id
    name
    items {
      group {
        id
        title
      }
      id
    	name
      column_values {
        id
        type
        value
        text
      }
    }
  }
  }`;
};

const getItems = async boardId => {
  try {
    return await instance.post('', {
      query: item(boardId),
    });
  } catch (err) {
    throw err;
  }
};

module.exports = getItems;
