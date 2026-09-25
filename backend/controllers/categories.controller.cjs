const Category = require("../models/category.schema.cjs");


// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).json({
            categories
        });

    } catch (error) {
        console.error("Get Categories Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// GET ONE CATEGORY
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        return res.status(200).json({
            category
        });

    } catch (error) {
        console.error("Get Category Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({
            name
        });

        if (existingCategory) {
            return res.status(409).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            description
        });

        return res.status(201).json({
            message: "Category created successfully",
            category
        });

    } catch (error) {
        console.error("Create Category Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const { name, description } = req.body;

        if (name !== undefined) {
            category.name = name;
        }

        if (description !== undefined) {
            category.description = description;
        }

        await category.save();

        return res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Update Category Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete Category Error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
