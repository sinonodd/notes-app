const monk = require('monk');
const db = monk('localhost/auth-newb');

module.exports = db;
