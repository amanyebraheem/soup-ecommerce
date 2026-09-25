const express = require("express");

const cartController = require("../controllers/cart.controller.cjs");

const authenticate = require("../middleware/auth.middleware.cjs");

const router = express.Router();


// Get my cart
router.get(
    "/",
    authenticate,
    cartController.getCart
);


// Add product to cart
router.post(
    "/items",
    authenticate,
    cartController.addToCart
);


// Remove product from cart
router.delete(
    "/items/:id",
    authenticate,
    cartController.removeFromCart
);


module.exports = router;
