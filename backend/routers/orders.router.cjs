const express = require("express");

const orderController = require("../controllers/orders.controller.cjs");

const authenticate = require("../middleware/auth.middleware.cjs");
const authorize = require("../middleware/role.middleware.cjs");

const router = express.Router();


// Create order
router.post(
    "/",
    authenticate,
    orderController.createOrder
);

router.get(
    "/",
    authenticate,
    authorize("admin"),
    orderController.getAllOrders
);

// My orders
router.get(
    "/me",
    authenticate,
    orderController.getMyOrders
);


// Admin update order status
router.patch(
    "/:id/status",
    authenticate,
    authorize("admin"),
    orderController.updateOrderStatus
);


module.exports = router;
