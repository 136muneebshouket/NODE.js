require("dotenv").config();
const pg = require('pg');

let database = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  dialectModule: pg,
  pool: {
    max: 100,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  retry: {
    max: 3, // number of times to retry a failed query
    match: [
      /SQLITE_BUSY/, // example error
      /SequelizeConnectionAcquireTimeoutError/,
      /SequelizeConnectionError/,
      /SequelizeTimeoutError/,
    ],
  },
  // dialectOptions: {
  //   // Your pg options here
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
  logging: true,
};

const config = {
  development: database,
  test: database,
  production: database,
};
module.exports = config;