const Sequelize = require("sequelize");

const sequelize = new Sequelize("inote-database", "root", "", {
  dialect: "mysql",
  host: "localhost",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

module.exports = sequelize;
