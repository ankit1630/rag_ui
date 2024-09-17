const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "193.203.166.32",
  user: "u746457015_boi_tax_user",
  password: "L|a4QZ$/7e",
  database: "u746457015_boi_tax_info",
});

module.exports = pool;
