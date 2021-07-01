const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.adminIndex = (req, res) => {
  res.render("admin/index");
};

exports.listUsers = async (req, res) => {
  await User.findAll()
    .then((users) => {
      if (users !== undefined) {
        res.render("admin/users/index", {
          users,
        });
      } else {
        res.render("admin/users/index");
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/users");
    });
};

exports.registerUser = (req, res) => {
  const message = undefined;
  res.render("admin/users/register", {
    message,
  });
};

exports.saveUser = async (req, res) => {
  const datas = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  await User.findOne({
    where: {
      email: datas.email,
    },
  })
    .then(async (user) => {
      if (user == undefined) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(datas.password, salt);

        await User.create({
          firstName: datas.firstName,
          lastName: datas.lastName,
          email: datas.email,
          password: hash,
        })
          .then(() => {
            res.redirect("/admin/users");
          })
          .catch((error) => {
            console.log(error);
            res.redirect("/admin/users");
          });
      } else {
        res.render("admin/users/register", {
          message: "This email was already registered.",
        });
        return;
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/register");
    });
};

exports.loginUser = async (req, res) => {
  res.render("admin/users/login", {
    message: undefined,
  });
};

exports.checkUser = async (req, res) => {
  const datas = {
    email: req.body.email,
    password: req.body.password,
  };

  await User.findOne({
    where: {
      email: datas.email,
    },
  })
    .then((user) => {
      if (user !== undefined) {
        const correctPw = bcrypt.compareSync(datas.password, user.password);

        if (correctPw) {
          req.session.user = {
            id: user.id,
            email: user.email,
          };
          res.redirect("/admin");
        } else {
          res.redirect(
            "/login?e=" + encodeURIComponent("incorrect_credential")
          );
        }
      } else {
        res.redirect("/login");
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/login");
    });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  if (id !== undefined && !isNaN(id)) {
    await User.destroy({
      where: {
        id,
      },
    })
      .then(() => {
        res.redirect("/admin/users");
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/admin/users");
      });
  }
};

exports.editUser = async (req, res) => {
  const id = req.params.id;

  await User.findByPk(id)
    .then((user) => {
      res.render("admin/users/edit", {
        user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/users");
    });
};

exports.saveEditedUser = async (req, res) => {
  const datas = {
    id: req.body.id,
    newFirstName: req.body.firstName,
    newLastName: req.body.lastName,
    newEmail: req.body.email,
    newPassword: req.body.password,
  };

  await User.findOne({
    where: {
      email: datas.newEmail,
    },
  })
    .then(async (user) => {
      if (user !== undefined) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(datas.newPassword, salt);

        if (datas.id !== undefined) {
          await User.findByPk(datas.id)
            .then(async (record) => {
              await record
                .update({
                  firstName: datas.newFirstName,
                  lastName: datas.newLastName,
                  email: datas.newEmail,
                  password: hash,
                })
                .then(() => {
                  res.redirect("/admin/users");
                })
                .catch((error) => {
                  console.log(error);
                  res.redirect("/admin/users");
                });
            })
            .catch((error) => {
              console.log(error);
              res.redirect("/admin/users");
            });
        }
      } else {
        res.redirect("/admin/users");
        return;
      }
    })
    .catch((error) => {
      console.log(error);
      res.redirect("/admin/users");
    });
};

exports.userLogout = (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
};
