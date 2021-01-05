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
  database: database
});

// Connect
con.connect(err => {
  if (err) console.log('ERROR:', err);
  else console.log("Connected to MySQL")
});

// module.exports = {
//   query: (text, params, callback) => {
//     console.log('executed query', text);
//     return con.query(text, params, callback);
//   }
// }
// module.exports = con.query(sql, function (err, result) {
//   if (err) throw err;
//   console.log("Result: " + result);
// });

module.exports = con;