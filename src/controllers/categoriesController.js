const Category = require("../models/Category");
const slugify = require("slugify");
const Article = require("../models/Article");

exports.listCategories = async (req, res) => {
  await Category.findAll()
    .then((categories) => {
      res.render("admin/categories/index", {
        categories,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/categories");
    });
};

exports.createCategorie = (req, res) => {
  res.render("admin/categories/new");
};

exports.saveCategorie = async (req, res) => {
  const datas = {
    title: req.body.title,
  };

  if (datas.title !== undefined) {
    await Category.create({
      title: datas.title,
      slug: slugify(datas.title).toLowerCase(),
    })
      .then(() => {
        res.redirect("/admin/categories");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/categories");
      });
  } else {
    res.redirect("/admin/categories/new");
  }
};

exports.deleteCategorie = async (req, res) => {
  const id = req.params.id;

  if (id !== undefined && !isNaN(id)) {
    await Category.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        res.redirect("/admin/categories");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/categories");
      });
  } else {
    res.redirect("/admin/categories");
  }
};

exports.editCategorie = async (req, res) => {
  const datas = {
    id: req.params.id,
    newTitle: req.body.newTitle,
  };

  if (datas.id !== undefined && datas.newTitle !== undefined) {
    await Category.findByPk(datas.id)
      .then(async (record) => {
        await record
          .update({
            title: datas.newTitle,
            slug: slugify(datas.newTitle).toLowerCase(),
          })
          .then(() => {
            res.redirect("/admin/categories");
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/admin/categories");
          });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/categories");
      });
  }
};

exports.articlesInCategory = async (req, res) => {
  const slug = req.params.slug;

  if (slug !== undefined) {
    await Category.findOne({
      where: {
        slug,
      },
      include: [{ model: Article }],
    })
      .then(async (category) => {
        if (category !== undefined) {
          await Category.findAll()
            .then((categories) => {
              res.render("articlesInCategory", {
                articles: category.articles,
                categories,
                category,
              });
            })
            .catch((error) => {
              console.log(error);
              res.redirect("/admin/categories");
            });
        } else {
          res.redirect("/");
        }
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/");
      });
  }
};
