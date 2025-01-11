const express = require("express");
const Router = require("express").Router();
const { isLoggedIn } = require("../middleware");
const orderController = require("../Controller/order");

Router.get("/placeOrder", isLoggedIn, orderController.placeOrders);
Router.post("/order/place", orderController.placeOrder);
Router.get("/", isLoggedIn, orderController.order);

module.exports = Router;
