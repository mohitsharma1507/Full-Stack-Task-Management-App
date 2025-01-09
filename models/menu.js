const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { url: String, filename: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model("Menu", MenuSchema);
