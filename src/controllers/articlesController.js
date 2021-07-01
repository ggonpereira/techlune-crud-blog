const Category = require("../models/Category");
const Article = require("../models/Article");
const slugify = require("slugify");

exports.listArticles = async (req, res) => {
  await Article.findAll({
    order: [["id", "DESC"]],
    include: [
      {
        model: Category,
      },
    ],
  })
    .then((articles, categories) => {
      res.render("admin/articles/index", {
        articles,
        categories,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/articles");
    });
};

exports.createArticle = async (req, res) => {
  await Category.findAll()
    .then((categories) => {
      res.render("admin/articles/new", {
        categories,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/articles/new");
    });
};

exports.editArticle = async (req, res) => {
  const id = req.params.id;

  if (id !== undefined) {
    await Article.findByPk(id)
      .then(async (article) => {
        await Category.findAll()
          .then((categories) => {
            res.render("admin/articles/edit", {
              article,
              categories,
            });
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/admin/articles");
          });
      })
      .catch((error) => {
        console.log(error);
        res.render("/admin/articles");
      });
  }
};

exports.saveEdited = async (req, res) => {
  const datas = {
    id: req.body.id,
    newTitle: req.body.title,
    newContent: req.body.content,
    newCategorySelected: req.body.category,
  };

  if (datas.id !== undefined) {
    await Article.findByPk(datas.id)
      .then(async (record) => {
        await record
          .update({
            title: datas.newTitle,
            slug: slugify(datas.newTitle).toLowerCase(),
            content: datas.newContent,
            categoryId: datas.newCategorySelected,
          })
          .then(() => {
            res.redirect("/admin/articles");
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/admin/articles");
          });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/articles");
      });
  }
};

exports.saveArticle = async (req, res) => {
  const datas = {
    title: req.body.title,
    categorySelected: req.body.category,
    content: req.body.content,
  };

  if (datas.title !== undefined) {
    await Article.create({
      title: datas.title,
      content: datas.content,
      slug: slugify(datas.title).toLowerCase(),
      categoryId: datas.categorySelected,
    })
      .then(() => {
        res.redirect("/admin/articles");
      })
      .catch((e) => {
        console.log(e);
        res.redirect("/admin/articles/new");
      });
  }
};

exports.deleteArticle = async (req, res) => {
  const id = req.params.id;

  if (id !== undefined) {
    await Article.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        res.redirect("/admin/articles");
      })
      .catch((e) => {
        console.log(e);
        res.redirect("/admin/articles");
      });
  }
};

exports.readArticle = async (req, res) => {
  const slug = req.params.slug;

  if (slug !== undefined) {
    await Article.findOne({
      where: {
        slug,
      },
    })
      .then(async (article) => {
        await Category.findAll()
          .then((categories) => {
            res.render("article", {
              article,
              categories,
            });
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/");
          });
      })
      .catch((e) => {
        console.log(e);
        res.redirect("/");
      });
  } else {
    res.redirect("/");
  }
};

exports.paginationArticle = async (req, res) => {
  let page = req.params.num;
  let offset = 0;

  if (isNaN(page) || page == 1) {
    offset = 0;
  } else {
    offset = (parseInt(page) - 1) * 6;
  }

  await Article.findAndCountAll({
    limit: 6,
    offset: offset,
    order: [["id", "DESC"]],
  })
    .then(async (articles) => {
      let next;
      if (offset + 6 >= articles.count) {
        next = false;
      } else {
        next = true;
      }

      const result = {
        page: parseInt(page),
        next,
        articles,
      };

      await Category.findAll()
        .then((categories) => {
          res.render("admin/articles/page", {
            result,
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
