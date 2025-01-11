const User = require("../models/user.js");

module.exports.renderregisterForm = (req, res) => {
  res.render("User/Register.ejs");
};

module.exports.Register = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Twiggy");
      res.redirect("/Menu");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/Register");
  }
};

module.exports.renderloginForm = (req, res) => {
  res.render("User/Login.ejs");
};

module.exports.Login = async (req, res) => {
  req.flash("success", "welcome to Twiggy! you are logged in!");
  let redirectUrl = res.locals.redirectUrl || "/Menu";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logout");
    res.redirect("/Menu");
  });
};
