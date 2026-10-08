const Order = require("../models/order.schema.cjs");
const Cart = require("../models/cart.schema.cjs");
const Product = require("../models/product.schema.cjs");


// ========================================
// CREATE ORDER
// ========================================

const createOrder = async (req, res) => {
    try {

        // 1. Get user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let total = 0;

        // ====================================
        // CHECK ALL PRODUCTS FIRST
        // ====================================

        for (const cartItem of cart.items) {

            const product = await Product.findById(
                cartItem.product._id ||
                cartItem.product
            );

            if (!product) {
                return res.status(404).json({
                    message:
                        "Product not found"
                });
            }

            // Check stock only when
            // creating the order

            if (
                product.stock <
                cartItem.quantity
            ) {
                return res.status(400).json({
                    message:
                        "Not enough stock for " +
                        product.name +
                        ". Available stock: " +
                        product.stock
                });
            }

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(cartItem.quantity) || 1;

            const itemTotal =
                price * quantity;

            total += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: quantity,
                price: price
            });
        }


        // ====================================
        // CREATE ORDER
        // ====================================

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            total: total,
            status: "confirmed"
        });


        // ====================================
        // DECREASE STOCK
        // ====================================

        for (const cartItem of cart.items) {

            const product =
                await Product.findById(
                    cartItem.product._id ||
                    cartItem.product
                );

            if (product) {

                product.stock =
                    product.stock -
                    cartItem.quantity;

                await product.save();
            }
        }


        // ====================================
        // EMPTY CART
        // ====================================

        cart.items = [];

        await cart.save();


        // ====================================
        // RETURN ORDER
        // ====================================

        return res.status(201).json({
            message:
                "Order created successfully",
            order
        });

    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );

        return res.status(500).json({
            message:
                error.message ||
                "Server error"
        });
    }
};


// ========================================
// GET MY ORDERS
// ========================================

const getMyOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user._id
        })
            .populate(
                "items.product"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            orders
        });

    } catch (error) {

        console.error(
            "Get My Orders Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// GET ALL ORDERS - ADMIN
// ========================================

const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .populate(
                "user",
                "name email"
            )
            .populate(
                "items.product"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            orders
        });

    } catch (error) {

        console.error(
            "Get All Orders Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// UPDATE ORDER STATUS - ADMIN
// ========================================

const updateOrderStatus = async (
    req,
    res
) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "confirmed",
            "cancelled"
        ];

        if (
            !allowedStatuses.includes(
                status
            )
        ) {
            return res.status(400).json({
                message:
                    "Invalid order status"
            });
        }

        const order =
            await Order.findById(
                req.params.id
            );

        if (!order) {
            return res.status(404).json({
                message:
                    "Order not found"
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message:
                "Order status updated successfully",
            order
        });

    } catch (error) {

        console.error(
            "Update Order Status Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};