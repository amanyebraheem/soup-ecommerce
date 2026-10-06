require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const userRouter = require("./routers/users.router.cjs");
const productRouter = require("./routers/products.router.cjs");
const categoryRouter = require("./routers/categories.router.cjs");
const cartRouter = require("./routers/cart.router.cjs");
const orderRouter = require("./routers/orders.router.cjs");

const app = express();

// ========================================
// CORS
// ========================================

app.use(cors());

// ========================================
// BODY PARSERS
// ========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// ========================================
// UPLOADS
// ========================================

const uploadsPath = path.join(__dirname, "uploads");

const productsUploadsPath = path.join(
    uploadsPath,
    "products"
);

fs.mkdirSync(productsUploadsPath, {
    recursive: true
});

console.log("UPLOADS PATH:", uploadsPath);

console.log(
    "PRODUCTS UPLOADS PATH:",
    productsUploadsPath
);

// ========================================
// STATIC IMAGES
// ========================================

app.use(
    "/uploads",
    express.static(uploadsPath)
);

// ========================================
// TEST IMAGE
// ========================================

app.get("/test-image", (req, res) => {
    const testFile = "1790204988458-942754944.jpg";

    const testPath = path.join(
        productsUploadsPath,
        testFile
    );

    console.log("Testing image:", testPath);

    if (!fs.existsSync(testPath)) {
        return res.status(404).json({
            message: "Image not found",
            path: testPath
        });
    }

    return res.sendFile(testPath);
});

// ========================================
// ROUTES
// ========================================

app.use("/api", userRouter);

app.use("/api/products", productRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/cart", cartRouter);

app.use("/api/orders", orderRouter);

// ========================================
// DATABASE
// ========================================

const connectToDB = async () => {
    try {
        mongoose.set("strictQuery", false);

        if (!process.env.MONGODB_URI) {
            throw new Error(
                "MONGODB_URI is missing from .env"
            );
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGODB_URI,
            {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000
            }
        );

        console.log("================================");
        console.log("Connected To MongoDB");

        console.log(
            "Database:",
            mongoose.connection.name
        );

        console.log("================================");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log("================================");

            console.log(
                `Server running on port ${PORT}`
            );

            console.log(
                `Uploads folder: ${uploadsPath}`
            );

            console.log(
                `Products folder: ${productsUploadsPath}`
            );

            console.log(
                `Test image: http://localhost:${PORT}/test-image`
            );

            console.log("================================");
        });

    } catch (error) {
        console.error("================================");
        console.error("MongoDB Connection Failed");
        console.error("================================");

        console.error("Error name:", error.name);

        console.error(
            "Error message:",
            error.message
        );

        if (error.reason) {
            console.error(
                "MongoDB topology:",
                error.reason.type
            );
        }

        console.error("================================");

        process.exit(1);
    }
};

// ========================================
// START SERVER
// ========================================

// Local development
if (require.main === module) {
    connectToDB();
}

module.exports = app;



