const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes");
const connection = require("./src/models/Database");
const session = require("express-session");

// Database connection
connection
  .authenticate()
  .then(() => {
    console.log("Successfully connected.");
  })
  .catch((error) => {
    console.log(error);
  });

// Configuring sessions
app.use(
  session({
    secret: process.env.SECRET_PHRASE,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
    },
  })
);

// Configure default static content folder
app.use(express.static(path.resolve(__dirname, "public")));

// Setting the default folder to views
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

// Body parser (to capture req.body content)
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// Use predefined routes
app.use(routes);

// Ignore favicon
function ignoreFavicon(req, res, next) {
  if (req.originalUrl.includes("favicon.ico")) {
    res.status(204).end();
  }
  next();
}
app.use(ignoreFavicon);

app.listen(80, () => {
  console.log("App running: http://localhost");
});
