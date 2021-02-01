const { default: { create } } = require('axios');
require('dotenv').config();

const { API_KEY, API_URL } = process.env;

const instance = create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: API_KEY
  }
})

module.exports = instance;