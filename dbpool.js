// load .env data into process.env
require("dotenv").config();

const { Pool } = require('pg');
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }, db
};


