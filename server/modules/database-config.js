var url = require('url');
var pg = require('pg');

if(process.env.DATABASE_URL) {
 var params = url.parse(process.env.DATABASE_URL);
 var auth = params.auth.split(':');

var config = {
  connectionString: process.env.DATABASE_URL,
  ssl: true,
};
} else {
 var config = {
   database: 'psp_database', // the name of the database
   host: 'localhost', // where is your database
   port: 5432, // the port number for your database
   max: 10, // how many connections at one time
   idleTimeoutMillis: 30000 // 30 seconds to try to connect
 };
}

module.exports = new pg.Pool(config);
