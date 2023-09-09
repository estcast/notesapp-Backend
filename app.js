"use-strict";                          //JS in stricted mode (for security)

require('dotenv').config();
const express = require("express");
const cors = require("cors");
let user_routes = require('./src/Routes/Identity_Routes');
let data_routes = require('./src/Routes/Data_Routes');

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());             //Switch the requests to json
app.use(cors());

app.use('/user', user_routes);
app.use('/notes', data_routes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
