"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import { apiRequest } from "../../lib/api";
import {
  addToCart,
  fetchCart,
} from "../../redux/slices/cartSlice";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest("/products");

        const products = Array.isArray(response)
          ? response
          : response.products || [];

        const foundProduct = products.find(
          (item) => item._id === params.id
        );

        if (!foundProduct) {
          setError("Product not found");
        } else {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Get product error:", error);

        setError(
          error?.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      getProduct();
    }
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setAdding(true);
      setMessage("");
      setError("");

      await dispatch(
        addToCart({
          productId: product._id,
          quantity: quantity,
        })
      ).unwrap();

      await dispatch(fetchCart()).unwrap();

      setMessage("Product added to cart successfully!");

      setTimeout(() => {
        router.push("/cart");
      }, 800);
    } catch (error) {
      console.error("Add to cart error:", error);

      setError(
        error?.message ||
          error ||
          "Failed to add product to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg font-semibold text-gray-500">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold text-red-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="rounded-xl bg-black px-6 py-3 font-bold text-white"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  let imageUrl = "/no-image.png";

  if (product?.image) {
    if (product.image.startsWith("http")) {
      imageUrl = product.image;
    } else if (product.image.startsWith("/uploads/")) {
      imageUrl =
        "http://localhost:5000" + product.image;
    } else {
      imageUrl = product.image;
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        <button
          type="button"
          onClick={() => router.push("/products")}
          className="mb-6 rounded-lg border bg-white px-4 py-2 text-sm font-semibold hover:bg-gray-100"
        >
          ← Back to Products
        </button>

        <div className="grid gap-10 rounded-3xl border bg-white p-6 shadow-sm md:grid-cols-2">

          {/* PRODUCT IMAGE */}

          <div className="flex min-h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">

            <img
              src={imageUrl}
              alt={product.name || "Product"}
              className="h-full max-h-[500px] w-full object-contain"
              onError={(event) => {
                event.currentTarget.src =
                  "/no-image.png";
              }}
            />

          </div>

          {/* PRODUCT INFORMATION */}

          <div className="flex flex-col justify-center">

            <p className="mb-3 text-sm font-medium text-gray-500">
              {product.category?.name || "Product"}
            </p>

            <h1 className="mb-4 text-4xl font-black text-gray-900">
              {product.name}
            </h1>

            <p className="mb-6 text-3xl font-bold text-blue-600">
              ${Number(product.price || 0).toFixed(2)}
            </p>

            <p className="mb-6 leading-7 text-gray-600">
              {product.description ||
                "No description available."}
            </p>

            <p className="mb-6 text-sm text-gray-500">
              Available stock:{" "}
              <span className="font-bold text-black">
                {product.stock}
              </span>
            </p>

            {/* QUANTITY */}

            {product.stock > 0 && (
              <div className="mb-6 flex items-center gap-4">

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.max(1, quantity - 1)
                    )
                  }
                  disabled={adding}
                  className="h-10 w-10 rounded-lg border bg-white text-lg font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>

                <span className="min-w-[30px] text-center font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity(
                      Math.min(
                        product.stock,
                        quantity + 1
                      )
                    )
                  }
                  disabled={adding}
                  className="h-10 w-10 rounded-lg border bg-white text-lg font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>

              </div>
            )}

            {/* SUCCESS */}

            {message && (
              <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 font-semibold text-green-700">
                {message}
              </div>
            )}

            {/* ERROR */}

            {error && product && (
              <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* ADD TO CART */}

            <button
              type="button"
              disabled={
                product.stock <= 0 || adding
              }
              onClick={handleAddToCart}
              className="rounded-xl bg-black py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {product.stock <= 0
                ? "Out of Stock"
                : adding
                ? "Adding to Cart..."
                : "Add to Cart"}
            </button>

          </div>
        </div>
      </div>
    </main>
  );
}