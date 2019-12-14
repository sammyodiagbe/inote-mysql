const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define("user", {
    id : {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
        unique: true
    },
    password:  {
        type: Sequelize.STRING,
        required: true,
        allowNull: false,
    },
    userPasswordResetToken: {
        type: Sequelize.STRING
    },
    userPasswordResetTokenExpiration: {
        type: Sequelize.STRING
    }
})

module.exports = User;