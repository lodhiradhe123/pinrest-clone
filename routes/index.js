var express = require("express");
var router = express.Router();
var userModel = require("./users");
const passport = require("passport");
const { route } = require("../app");

/* GET home page. */

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/profile", isLoggedIn, function (req, res) {
  res.render("profile");
});

router.post("/register", function (req, res) {
  const data = new userModel({
    username: req.body.username,
    password: req.body.password,
    contact: req.body.contact,
    email: req.body.email,
  });
  userModel.register(data, req.body.password).then(function () {
    passport.authenticate("local")(req, res._construct, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  }),
  function (req, res, next) {}
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
