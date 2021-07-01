const Sequelize = require("sequelize");
const connection = require("./Database");

const Category = connection.define("categories", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// IMPORTANT! ONLY "des"COMMENT THIS LINE ABOVE IF YOU WANT CREATE A NEW TABLE!
// Category.sync({ force: true });

module.exports = Category;
