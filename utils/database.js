const Sequelize = require("sequelize");
const enviroment = process.env.DEV_ENV;
const connnectionString =
  enviroment === "localhost"
    ? process.env.LOCAL_DATABASE_CONNECTION_STRING
    : process.env.DATABASE_CONNECTION_STRING;
const sequelize = new Sequelize(connnectionString, {
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
