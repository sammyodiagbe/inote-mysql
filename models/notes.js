const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Notes = sequelize.define("note", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    default: ""
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false,
    default: "default"
  }
});

module.exports = Notes;
