const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const userRouter = require("./routers/users.router.cjs");
const productRouter = require("./routers/products.router.cjs");
const categoryRouter = require("./routers/categories.router.cjs");
const cartRouter = require("./routers/cart.router.cjs");
const orderRouter = require("./routers/orders.router.cjs");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* =========================
   UPLOADS
========================= */

const uploadsPath = path.join(__dirname, "uploads");
const productsUploadsPath = path.join(uploadsPath, "products");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

if (!fs.existsSync(productsUploadsPath)) {
  fs.mkdirSync(productsUploadsPath, { recursive: true });
}

app.use("/uploads", express.static(uploadsPath));

/* =========================
   TEST ROUTE
========================= */

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Souq API is working",
  });
});

/* =========================
   API ROUTES
========================= */

app.use("/api", userRouter);

app.use("/api/products", productRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/cart", cartRouter);

app.use("/api/orders", orderRouter);

/* =========================
   404 API
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

/* =========================
   ERROR HANDLER
========================= */

app.use((error, req, res, next) => {
  console.error("API ERROR:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;