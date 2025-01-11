const express = require("express");
const router = require("express").Router();
const menuController = require("../Controller/menu");
const ExpressError = require("../views/utils/ExpressError");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig");
const { MenuSchema } = require("../schema");
const upload = multer({ storage });

const validateMenu = (req, res, next) => {
  let { error } = MenuSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
router.get("/", menuController.index);
router.get("/new", isLoggedIn, menuController.renderNewForm);
router.post(
  "/",
  isLoggedIn,
  upload.single("menu[image]"),
  validateMenu,
  menuController.create
);
router.get("/:id", menuController.show);
router.put(
  "/:id",
  isLoggedIn,
  upload.single("menu[image]"),
  validateMenu,
  menuController.update
);
router.get("/:id/edit", isLoggedIn, menuController.edit);
router.delete("/:id", isLoggedIn, menuController.delete);

module.exports = router;
