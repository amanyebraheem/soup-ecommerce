"use client";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.cart);

  const imageUrl = product?.image
    ? `http://localhost:5000${product.image}`
    : null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      })
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#f0e2de] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* Image */}
      <div className="flex h-64 w-full items-center justify-center bg-[#f8ebe7]">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product?.name || "Product"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/no-image.png";
            }}
          />
        ) : (
          <span className="text-gray-400">
            No Image
          </span>
        )}

      </div>

      {/* Product Info */}
      <div className="p-5">

        <h2 className="text-lg font-bold text-gray-800">
          {product?.name}
        </h2>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
          {product?.description}
        </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="text-lg font-bold text-[#b97970]">
            ${product?.price}
          </span>

          <span className="text-xs text-gray-400">
            Stock: {product?.stock}
          </span>

        </div>

        {/* Add To Cart */}
        <button
          onClick={handleAddToCart}
          disabled={loading || product?.stock <= 0}
          className="mt-5 w-full rounded-full bg-[#b97970] py-3 font-semibold text-white transition hover:bg-[#a9675f] disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product?.stock <= 0
            ? "Out of Stock"
            : loading
              ? "Adding..."
              : "Add to Cart"}
        </button>

      </div>
    </div>
  );
}
