const mongoose = require("mongoose");

const Order = require("../models/order.schema.cjs");
const Cart = require("../models/cart.schema.cjs");
const Product = require("../models/product.schema.cjs");


// ========================================
// CREATE ORDER
// ========================================

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        // Start Transaction
        session.startTransaction();

        // 1. Get user's cart
        const cart = await Cart.findOne({
            user: req.user._id
        }).session(session);

        if (!cart || cart.items.length === 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Cart is empty"
            });
        }

        const orderItems = [];
        let total = 0;

        // 2. Check every cart item
        for (const cartItem of cart.items) {

            const product = await Product.findById(
                cartItem.product
            ).session(session);

            // Product doesn't exist
            if (!product) {
                await session.abortTransaction();

                return res.status(404).json({
                    message: `Product not found: ${cartItem.product}`
                });
            }

            // 3. Check stock
            if (product.stock < cartItem.quantity) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            // 4. Get price from database
            // Never trust price from client
            const price = product.price;

            // 5. Calculate item total
            const itemTotal = price * cartItem.quantity;

            // Add to order total
            total += itemTotal;

            // 6. Add product to order items
            orderItems.push({
                product: product._id,
                quantity: cartItem.quantity,
                price: price
            });

            // 7. Decrease stock
            product.stock -= cartItem.quantity;

            await product.save({
                session
            });
        }

        // 8. Create order
        const createdOrders = await Order.create(
            [
                {
                    user: req.user._id,
                    items: orderItems,
                    total: total,
                    status: "confirmed"
                }
            ],
            {
                session
            }
        );

        const order = createdOrders[0];

        // 9. Empty cart
        cart.items = [];

        await cart.save({
            session
        });

        // 10. Commit transaction
        await session.commitTransaction();

        // 11. Return order
        return res.status(201).json({
            message: "Order created successfully",
            order
        });

    } catch (error) {

        // Rollback all changes if something fails
        await session.abortTransaction();

        console.error("Create Order Error:", error);

        return res.status(500).json({
            message: "Server error"
        });

    } finally {

        // Close session
        session.endSession();
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
            .populate("items.product")
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            orders
        });

    } catch (error) {

        console.error("Get My Orders Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// ADMIN UPDATE ORDER STATUS
// ========================================

const updateOrderStatus = async (req, res) => {
    try {

        const { status } = req.body;

        // Allowed statuses
        const allowedStatuses = [
            "pending",
            "confirmed",
            "cancelled"
        ];

        // Validate status
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        // Find order
        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Update status
        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
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
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
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
// EXPORT
// ========================================

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};
