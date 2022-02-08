// load .env data into process.env
require("dotenv").config();

const { db } = require("./dbpool");
const { sendMessage } = require("./services/twilio");

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

const database = require("./database");

db.connect();

app.use(morgan("dev"));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));
app.use((req, res, next) => {
  database.findUser(req.session.user_id).then((response) => {
    res.locals.user = response;
    return next();
  });
});

// Separated Routes for each Resource

const login = require("./routes/login");
const orders = require("./routes/orders");
const manage = require("./routes/manage");
const updateMenu = require("./routes/update-menu")

// Mount all resource routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/logout", (req, res) => {
  res.clearCookie('session');
  res.redirect("/");
});

app.use("/login", login);

app.use("/orders", orders);

app.use("/manage", manage);

app.use("/update-menu", updateMenu);

app.get("/menu", (req, res) => {
  database.menuItems().then((items) => {
    let templateVars = { items };
    res.render("menu", templateVars);
  });
});

app.post("/profile", (req, res) => {
  const id = req.session.user_id;
  console.log("THIS IS MY LOG:" + JSON.stringify(req.body));
  database.updateUser(id, req.body).then((result) => {
    res.redirect("/profile");
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
