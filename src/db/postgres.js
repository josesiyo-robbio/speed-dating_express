require('dotenv').config();


const pgp = require('pg-promise')();


const connectionURL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const db = pgp(connectionURL);


module.exports = db;