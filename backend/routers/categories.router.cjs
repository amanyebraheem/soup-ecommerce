const express = require("express");

const categoryController = require("../controllers/categories.controller.cjs");

const authenticate = require("../middleware/auth.middleware.cjs");
const authorize = require("../middleware/role.middleware.cjs");

const router = express.Router();


// Public
router.get(
    "/",
    categoryController.getCategories
);

router.get(
    "/:id",
    categoryController.getCategoryById
);


// Admin only
router.post(
    "/",
    authenticate,
    authorize("admin"),
    categoryController.createCategory
);

router.patch(
    "/:id",
    authenticate,
    authorize("admin"),
    categoryController.updateCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("admin"),
    categoryController.deleteCategory
);


module.exports = router;
