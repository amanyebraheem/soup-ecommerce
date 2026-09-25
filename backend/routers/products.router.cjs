const express = require("express");

const productController = require("../controllers/products.controller.cjs");

const authenticate = require("../middleware/auth.middleware.cjs");
const authorize = require("../middleware/role.middleware.cjs");
const upload = require("../middleware/upload.middleware.cjs");

const router = express.Router();

router.get(
"/",
productController.getProducts
);

router.post(
"/",
authenticate,
authorize("seller"),
upload.single("image"),
productController.createProduct
);

router.get(
"/seller/me",
authenticate,
authorize("seller"),
productController.getMyProducts
);

router.patch(
"/:id",
authenticate,
authorize("seller"),
upload.single("image"),
productController.updateProduct
);

router.delete(
"/:id",
authenticate,
authorize("seller"),
productController.deleteProduct
);

module.exports = router;