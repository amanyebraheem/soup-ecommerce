"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const BACKEND_URL = "http://localhost:5000";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth?.user);
  const cartLoading = useSelector((state) => state.cart?.loading);

  if (!product) {
    return null;
  }

  let imageUrl = "/no-image.png";

  if (product.image) {
    if (product.image.startsWith("http")) {
      imageUrl = product.image;
    } else {
      imageUrl = BACKEND_URL + product.image;
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      await dispatch(
        addToCart({
          productId: product._id,
          quantity: 1,
        })
      ).unwrap();

      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(error || "Failed to add product to cart");
    }
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Product Image */}

      <Link href={"/products/" + product._id}>
        <div className="relative h-64 overflow-hidden bg-gray-100">

          <img
            src={imageUrl}
            alt={product.name || "Product"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(event) => {
              console.error("Image failed:", imageUrl);
              event.currentTarget.src = "/no-image.png";
            }}
          />

          {product.stock <= 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
              Out of Stock
            </span>
          )}

        </div>
      </Link>

      {/* Product Information */}

      <div className="p-5">

        <Link href={"/products/" + product._id}>
          <h3 className="line-clamp-1 text-lg font-bold text-gray-800 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {product.category?.name && (
          <p className="mt-1 text-sm text-gray-500">
            {product.category.name}
          </p>
        )}

        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="text-xl font-bold text-blue-600">
            ${Number(product.price || 0).toFixed(2)}
          </span>

          <span className="text-xs text-gray-500">
            Stock: {product.stock}
          </span>

        </div>

        {/* Buttons */}

        <div className="mt-4 flex gap-2">

          <Link
            href={"/products/" + product._id}
            className="flex-1 rounded-lg border border-blue-600 px-3 py-2 text-center text-sm font-semibold text-blue-600 hover:bg-blue-50"
          >
            View Details
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={cartLoading || product.stock <= 0}
            className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {product.stock <= 0
              ? "Out of Stock"
              : cartLoading
              ? "Adding..."
              : "Add to Cart"}
          </button>

        </div>
      </div>
    </div>
  );
}