require('dotenv').config();

const db = require('./db/connect');

const { _main } = require('./services/mainFunction');
db.sync().then( async () => {
  console.log(`Connected to ${process.env.DB_NAME} database`);
  await _main();
  console.log("Done working.");
}).catch(err => console.error(err));

// ! development mode <...>

  // const { json, Router, urlencoded } = require('express');
  // const express = require('express');
  
  // /** Middlewares */
  // const cors = require('cors');
  // const _error = require('./middleware/error');
  
  // /** Routes */
  // const routes = require('./routes/routes');
  
  // /** Instances */
  // const app = express();
  // const router = Router();
  
  // /** Middleware Implementations */
  // app.use(cors());
  // app.use(urlencoded({ extended: false }));
  // app.use(json());
  
  // /** Route Implementation */
  // app.use(routes(router));
  
  // /**  Error Middleware */
  // app.use(_error);
  
  // app.listen(3000, () => {
  //   console.log('Server connected to port', 3000);
  //   db.sync().then(() => console.log("Connected to 'Monday_Project_Management_IT' database")).catch(err => console.error(err))
  // })
