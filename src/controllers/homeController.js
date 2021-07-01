const Article = require("../models/Article");
const Category = require("../models/Category");

exports.indexPage = async (req, res) => {
  await Article.findAll({
    order: [["id", "DESC"]],
    limit: 6,
  })
    .then((articles) => {
      Category.findAll()
        .then((categories) => {
          res.render("index", {
            articles,
            categories,
          });
        })
        .catch((error) => {
          console.log(error);
          res.redirect("/");
        });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/");
    });
};
