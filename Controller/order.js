const Order = require("../models/order");
const Menu = require("../models/menu");

// GET Place Order Page
module.exports.placeOrders = async (req, res) => {
  try {
    const menuItems = await Menu.find(); // Fetch all menu items
    res.render("Order/placeOrder", { menuItems }); // Render place order page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching menu items.");
  }
};

module.exports.placeOrder = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    console.log("Received itemId:", itemId); // Debug log
    console.log("Received quantity:", quantity); // Debug log

    // Ensure user is logged in
    if (!req.user) {
      return res.status(401).send("You need to log in first.");
    }

    // Fetch the menu item details
    const menuItem = await Menu.findById(itemId);
    console.log("Menu item fetched:", menuItem); // Debug log

    if (!menuItem) {
      return res.status(404).send("Menu item not found");
    }

    // Calculate total amount
    const totalAmount = menuItem.price * parseInt(quantity, 10);

    // Create a new order
    const order = new Order({
      userId: req.user._id,
      items: [
        {
          menuItem: menuItem._id,
          quantity: parseInt(quantity, 10),
        },
      ],
      totalAmount,
      status: "Placed", // Default status
      createdAt: new Date(),
    });

    await order.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error placing the order");
  }
};

// GET Orders Page
module.exports.order = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
      "items.menuItem"
    ); // Populate menu item details
    res.render("Order/order", { orders }); // Render orders page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching orders.");
  }
};
