require("dotenv").config();
const { PGURLW, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
const types = require("pg").types;
const knex = require("knex")({
  client: "pg",
  connection: {
    host: PGURLW,
    port: PGPORT,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
  },
  pool: {
    min: 0,
    max: 7,
    acquireTimeoutMillis: 300000,
    createTimeoutMillis: 300000,
    destroyTimeoutMillis: 50000,
    idleTimeoutMillis: 300000,
    reapIntervalMillis: 10000,
    createRetryIntervalMillis: 2000,
    propagateCreateError: false,
  },
  acquireConnectionTimeout: 60000,
});
knex
  .raw("SELECT 1")
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
  });
types.setTypeParser(types.builtins.NUMERIC, (value) => {
  return parseFloat(value);
});

types.setTypeParser(types.builtins.INT4, (value) => {
  return parseFloat(value);
});
types.setTypeParser(types.builtins.INT8, (value) => {
  return parseFloat(value);
});

module.exports = knex;
