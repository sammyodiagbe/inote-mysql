const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
  dialect: "mysql",
  host: process.env.DATBASE_HOST,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

module.exports = sequelize;
