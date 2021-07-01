const Sequelize = require("sequelize");
const connection = require("./Database");

const Users = connection.define("users", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// IMPORTANT! ONLY "des"COMMENT THIS LINE ABOVE IF YOU WANT CREATE A NEW TABLE!
// Users.sync({ force: true });

module.exports = Users;
