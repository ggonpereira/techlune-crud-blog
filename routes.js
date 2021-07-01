const express = require("express");
const router = express.Router();
const homeController = require("./src/controllers/homeController");
const categoriesController = require("./src/controllers/categoriesController");
const articlesController = require("./src/controllers/articlesController");
const usersController = require("./src/controllers/usersController");
const verifySession = require("./src/middlewares/verifySession");

// Index routes
router.get("/", homeController.indexPage);

// Categories routes
router.get(
  "/admin/categories",
  verifySession,
  categoriesController.listCategories
);
router.get(
  "/admin/categories/new",
  verifySession,
  categoriesController.createCategorie
);
router.get("/categories/:slug", categoriesController.articlesInCategory);
router.post(
  "/admin/categories/save",
  verifySession,
  categoriesController.saveCategorie
);
router.post(
  "/admin/categories/delete/:id",
  verifySession,
  categoriesController.deleteCategorie
);
router.post(
  "/admin/categories/edit/:id",
  verifySession,
  categoriesController.editCategorie
);

// Article routes
router.get("/admin/articles", verifySession, articlesController.listArticles);
router.get(
  "/admin/articles/new",
  verifySession,
  articlesController.createArticle
);
router.get(
  "/admin/articles/edit/:id",
  verifySession,
  articlesController.editArticle
);
router.get("/article/:slug", articlesController.readArticle);
router.get("/articles/page/:num", articlesController.paginationArticle);
router.post(
  "/admin/articles/save",
  verifySession,
  articlesController.saveArticle
);
router.post(
  "/admin/articles/delete/:id",
  verifySession,
  articlesController.deleteArticle
);
router.post(
  "/admin/articles/edit/:id/update",
  verifySession,
  articlesController.saveEdited
);

// User routes
router.get("/admin", verifySession, usersController.adminIndex);
router.get("/admin/users", verifySession, usersController.listUsers);
router.get("/register", usersController.registerUser);
router.get("/login", usersController.loginUser);
router.get("/admin/users/edit/:id", verifySession, usersController.editUser);
router.post("/admin/users/register/create", usersController.saveUser);
router.post("/login/check", usersController.checkUser);
router.post(
  "/admin/users/delete/:id",
  verifySession,
  usersController.deleteUser
);
router.post(
  "/admin/users/edit/:id/update",
  verifySession,
  usersController.saveEditedUser
);
router.get("/admin/logout", verifySession, usersController.userLogout);

module.exports = router;
