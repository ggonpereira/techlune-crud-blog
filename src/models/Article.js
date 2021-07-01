const Sequelize = require("sequelize");
const connection = require("./Database");
const Category = require("./Category");

const Article = connection.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

// Declaring relations
Category.hasMany(Article); // UMA categoria tem MUITOS arquivos (1 - N)
Article.belongsTo(Category); // UM artigo pertence a UMA categoria (1 - 1)

// IMPORTANT! ONLY "des"COMMENT THIS LINE ABOVE IF YOU WANT CREATE A NEW TABLE!
// Article.sync({ force: true });

module.exports = Article;
