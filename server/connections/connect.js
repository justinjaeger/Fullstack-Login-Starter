const mysql = require('mysql');
const path = require('path');

// Declare path to locate ENV files
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env')
})

// ENV Variables
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;

// Create connection
const con = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
});

// Connect
con.connect(err => {
  if (err) console.log('ERROR:', err);
  else console.log("Connected to MySQL")
});

// Export the connection
module.exports = con;