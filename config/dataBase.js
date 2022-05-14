const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.HOST_DB, 
    user: process.env.USER_DB, 
    password: process.env.PASS_DB, 
    database: process.env.NAME_DB,
    port: process.env.PORT_DB,

})

module.exports = { pool }