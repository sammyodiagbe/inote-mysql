const Sequelize = require("sequelize");
const enviroment = process.env.DEV_ENV;
const connectionString =
  enviroment === "production"
    ? process.env.LOCAL_DATABASE_CONNECTION_STRING
    : process.env.DATABASE_CONNECTION_STRING;
// process.env.JAWSDB_URL
const sequelize = new Sequelize("inote-database", "root", "", {
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

module.exports = sequelize;
