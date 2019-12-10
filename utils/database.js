const Sequelize = require("sequelize");

const sequelize = new Sequelize("inote-database", "root", "", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;
