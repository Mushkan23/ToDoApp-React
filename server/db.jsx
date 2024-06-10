const { Pool } = require('pg')
require('dotenv').config()


//Before .env file doen't have
 const pool = new Pool({
     user: 'postgres',
    password: '1234',
    host: 'localhost',
    port: 5432,
    database: 'todoapp'
})


//After the .env file is added it will store the all imp things
/*
const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DBPORT,
    database: 'todoapp'
})
*/


module.exports = pool
