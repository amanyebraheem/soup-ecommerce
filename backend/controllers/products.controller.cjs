
const Product = require("../models/product.schema.cjs");
const Category = require("../models/category.schema.cjs");


// ========================================
// GET ALL PRODUCTS
// ========================================

const getProducts = async (req, res) => {
    try {

        const {
            category,
            minPrice,
            search
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (minPrice) {
            filter.price = {
                $gte: Number(minPrice)
            };
        }

        if (search) {
            filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        const products = await Product.find(filter)
            .populate("category", "name")
            .populate("seller", "name email");

        return res.status(200).json({
            products
        });

    } catch (error) {

        console.error(
            "Get Products Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// CREATE PRODUCT
// ========================================

const createProduct = async (req, res) => {

    try {

        console.log("========== PRODUCT REQUEST ==========");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        console.log("USER:", req.user);
        console.log("=====================================");


        const {
            name,
            description,
            price,
            stock,
            category
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !name ||
            !description ||
            price === undefined ||
            stock === undefined ||
            !category
        ) {

            return res.status(400).json({
                message:
                    "Name, description, price, stock and category are required",

                receivedBody: req.body,

                receivedFile: req.file
                    ? req.file.filename
                    : null
            });
        }


        // ========================================
        // CHECK CATEGORY
        // ========================================

        const categoryExists =
            await Category.findById(category);

        if (!categoryExists) {

            return res.status(404).json({
                message: "Category not found"
            });
        }


        // ========================================
        // IMAGE
        // ========================================

        let image = null;

        if (req.file) {

            image =
                `/uploads/products/${req.file.filename}`;
        }


        // ========================================
        // CREATE
        // ========================================

        const product = await Product.create({

            name,

            description,

            price: Number(price),

            stock: Number(stock),

            category,

            image,

            seller: req.user._id
        });


        return res.status(201).json({

            message:
                "Product created successfully",

            product
        });


    } catch (error) {

        console.error(
            "Create Product Error:",
            error
        );

        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// ========================================
// GET MY PRODUCTS
// ========================================

const getMyProducts = async (req, res) => {

    try {

        const products = await Product.find({
            seller: req.user._id
        })
            .populate("category", "name")
            .populate("seller", "name email")
            .sort({
                createdAt: -1
            });


        return res.status(200).json({
            products
        });

    } catch (error) {

        console.error(
            "Get My Products Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// UPDATE PRODUCT
// ========================================

const updateProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }


        // Seller owns product?
        if (
            product.seller.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message:
                    "You can only update your own products"
            });
        }


        const {
            name,
            description,
            price,
            stock,
            category
        } = req.body;


        if (category) {

            const categoryExists =
                await Category.findById(category);

            if (!categoryExists) {

                return res.status(404).json({
                    message: "Category not found"
                });
            }

            product.category = category;
        }


        if (name !== undefined) {
            product.name = name;
        }

        if (description !== undefined) {
            product.description = description;
        }

        if (price !== undefined) {
            product.price = Number(price);
        }

        if (stock !== undefined) {
            product.stock = Number(stock);
        }


        if (req.file) {

            product.image =
                `/uploads/products/${req.file.filename}`;
        }


        await product.save();


        return res.status(200).json({

            message:
                "Product updated successfully",

            product
        });

    } catch (error) {

        console.error(
            "Update Product Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// ========================================
// DELETE PRODUCT
// ========================================

const deleteProduct = async (req, res) => {

    try {

        const product =
            await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }


        if (
            product.seller.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                message:
                    "You can only delete your own products"
            });
        }


        await Product.findByIdAndDelete(
            req.params.id
        );


        return res.status(200).json({
            message:
                "Product deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getProducts,
    createProduct,
    getMyProducts,
    updateProduct,
    deleteProduct
};
