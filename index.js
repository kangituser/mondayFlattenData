require('dotenv').config();

const db = require('./db/connect');

const { _main } = require('./services/mainFunction');

db.sync().then( async () => {
  console.log(`Connected to ${process.env.DB_NAME} database`);
  await _main();
  console.log("Done working.");
}).catch(err => console.error(err));
