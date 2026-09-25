const Cart = require("../models/cart.schema.cjs");
const Product = require("../models/product.schema.cjs");


// GET CART
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id
        }).populate("items.product");

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        return res.status(200).json({
            cart
        });

    } catch (error) {
        console.error("Get Cart Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ADD ITEM TO CART
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
            return res.status(400).json({
                message: "Product ID and quantity are required"
            });
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                message: "Not enough stock"
            });
        }

        let cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: "Not enough stock"
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        await cart.populate("items.product");

        return res.status(200).json({
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        console.error("Add Cart Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE ITEM FROM CART
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.id(id);

        if (!item) {
            return res.status(404).json({
                message: "Cart item not found"
            });
        }

        item.deleteOne();

        await cart.save();

        return res.status(200).json({
            message: "Item removed from cart",
            cart
        });

    } catch (error) {
        console.error("Remove Cart Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getCart,
    addToCart,
    removeFromCart
};
