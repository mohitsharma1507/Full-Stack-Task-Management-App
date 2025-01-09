const User = require("../models/user.js");
const { createSecretToken } = require("../views/utils/SecretToken.js");
const bcrypt = require("bcryptjs");

module.exports.renderregisterForm = (req, res) => {
  res.render("User/Register.ejs");
};

module.exports.Register = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "User with this email already exists.");
      return res.redirect("/Register"); // Redirect to the signup page
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    });

    // Generate a token and set it as a cookie
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true, // Ensure the cookie is secure
    });

    // Set success flash message and redirect to the menu
    req.flash("success", "Welcome to Tiggy!");
    res.redirect("/Menu");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/Register"); // Redirect to the signup page
  }
};
module.exports.renderloginForm = (req, res) => {
  res.render("User/Login.ejs");
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body; // Fix destructuring to match expected fields

    // Check for missing fields
    if (!email || !password) {
      req.flash("error", "All fields are required.");
      return res.redirect("/Login"); // Redirect back to the login page
    }

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/Login"); // Redirect back to the login page
    }

    // Verify the password
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      req.flash("error", "Incorrect email or password.");
      return res.redirect("/Login"); // Redirect back to the login page
    }

    // Generate a token and set it as a cookie
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true, // Ensure the cookie is secure
    });

    // Set success flash message and redirect to the menu
    req.flash("success", "Welcome to Tiggy! You are logged in!");
    res.redirect("/Menu");
  } catch (error) {
    console.error(error);
    req.flash("error", "Server error. Please try again later.");
    res.redirect("/Login");
  }
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
