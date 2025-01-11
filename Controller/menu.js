const Menu = require("../models/menu");

module.exports.index = async (req, res) => {
  const allMenus = await Menu.find({});
  res.render("Menu/index.ejs", { allMenus });
};

module.exports.renderNewForm = (req, res) => {
  res.render("Menu/new.ejs", { menu: { availability: false } });
};
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const menu = await Menu.findById(id);
  if (!menu) {
    req.flash("error", "Menu u requested for  does not exits");
    res.redirect("/Menu");
  }

  res.render("Menu/show.ejs", { menu });
};

module.exports.create = async (req, res, next) => {
  try {
    const availability = req.body.menu.availability === "true";

    const newMenu = new Menu({ ...req.body.menu, availability });
    if (req.file) {
      newMenu.image = { url: req.file.path, filename: req.file.filename };
    }
    await newMenu.save();
    req.flash("success", "Menu created successfully");
    res.redirect("/Menu");
  } catch (err) {
    next(err);
  }
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const menu = await Menu.findById(id);
  if (!menu) {
    res.redirect("/Menu");
  }

  let originalImageUrl = menu.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_150");
  res.render("Menu/edit.ejs", { menu, originalImageUrl });
};

module.exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = req.body.menu.availability === "true";

    const menu = await Menu.findByIdAndUpdate(
      id,
      { ...req.body.menu, availability },
      { new: true, runValidators: true }
    );
    if (req.file) {
      menu.image = { url: req.file.path, filename: req.file.filename };
      await menu.save();
    }
    req.flash("success", "Menu updated successfully");
    res.redirect("/Menu");
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedMenu = await Menu.findByIdAndDelete(id);
  req.flash("success", "Menu deleted");
  res.redirect("/Menu");
};
