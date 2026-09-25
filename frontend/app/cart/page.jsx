"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  fetchCart,
  removeFromCart,
} from "../redux/slices/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth);

  const {
    cart,
    loading,
    error,
  } = useSelector((state) => state.cart);

  // Fetch cart
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  // Protect page
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const items = cart?.items || [];

  // Cart total
  const total = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.product?.price) || 0) *
        (Number(item.quantity) || 0),
    0
  );

  // Total products quantity
  const totalItems = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0),
    0
  );

  // Remove product
  const handleRemove = async (id) => {
    try {
      await dispatch(removeFromCart(id)).unwrap();

      // Refresh cart after removing
      dispatch(fetchCart());
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffaf8] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97970]">
            Your Shopping Bag
          </p>

          <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
            Shopping Cart
          </h1>

          <p className="mt-3 text-gray-500">
            Review your skincare products before checkout.
          </p>
        </div>

        {/* ================= ERROR ================= */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="rounded-3xl border border-[#f0e2de] bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#f0d8d3] border-t-[#b97970]" />

            <p className="text-gray-500">
              Loading your cart...
            </p>
          </div>
        )}

        {/* ================= EMPTY CART ================= */}
        {!loading && items.length === 0 && (
          <div className="rounded-3xl border border-[#f0e2de] bg-white px-6 py-16 text-center shadow-sm">

            {/* Empty Cart Icon */}
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#f8ebe7]">
              <span className="text-5xl">
                🛒
              </span>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-500">
              You haven't added any skincare products yet.
              Discover our collection and find something you love.
            </p>

            <button
              onClick={() => router.push("/products")}
              className="mt-7 rounded-full bg-[#b97970] px-8 py-3 font-semibold text-white transition hover:bg-[#a9675f]"
            >
              Browse Products
            </button>

          </div>
        )}

        {/* ================= CART ================= */}
        {!loading && items.length > 0 && (
          <div className="grid gap-8 lg:grid-cols-3">

            {/* ================= PRODUCTS ================= */}
            <div className="space-y-4 lg:col-span-2">

              {items.map((item) => {
                const product = item.product;

                /*
                  Product Image
                  Backend example:
                  /uploads/products/image.jpg

                  Full URL:
                  http://localhost:5000/uploads/products/image.jpg
                */
                const imageUrl = product?.image
                  ? `http://localhost:5000${product.image}`
                  : null;

                const price =
                  Number(product?.price) || 0;

                const quantity =
                  Number(item.quantity) || 0;

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    key={item._id}
                    className="rounded-3xl border border-[#f0e2de] bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                  >

                    <div className="flex gap-4 sm:gap-6">

                      {/* ================= PRODUCT IMAGE ================= */}
                      <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-[#f8ebe7] sm:h-36 sm:w-36">

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              product?.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : null}

                      </div>

                      {/* ================= PRODUCT INFO ================= */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">

                        <div>

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#b97970]">
                                Skincare
                              </p>

                              <h2 className="truncate text-lg font-bold text-gray-900 sm:text-xl">
                                {product?.name ||
                                  "Product"}
                              </h2>

                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                handleRemove(
                                  item._id
                                )
                              }
                              className="flex-shrink-0 text-sm font-medium text-gray-400 transition hover:text-red-500"
                            >
                              Remove
                            </button>

                          </div>

                          {/* Description */}
                          {product?.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                              {product.description}
                            </p>
                          )}

                        </div>

                        {/* ================= PRICE ================= */}
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

                          {/* Quantity */}
                          <div className="flex items-center overflow-hidden rounded-full border border-[#ead5d0]">

                            <span className="px-4 py-2 text-sm text-gray-500">
                              Quantity
                            </span>

                            <span className="border-l border-[#ead5d0] px-4 py-2 text-sm font-semibold text-gray-800">
                              {quantity}
                            </span>

                          </div>

                          {/* Price */}
                          <div className="text-right">

                            <p className="text-xs text-gray-400">
                              ${price.toFixed(2)} ×{" "}
                              {quantity}
                            </p>

                            <p className="mt-1 text-lg font-bold text-[#b97970]">
                              ${itemTotal.toFixed(2)}
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

              {/* ================= CONTINUE SHOPPING ================= */}
              <button
                type="button"
                onClick={() =>
                  router.push("/products")
                }
                className="pt-2 text-sm font-semibold text-[#b97970] transition hover:text-[#92564f]"
              >
                ← Continue Shopping
              </button>

            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="h-fit rounded-3xl border border-[#f0e2de] bg-white p-6 shadow-sm lg:sticky lg:top-28">

              {/* Summary Header */}
              <div className="flex items-center justify-between gap-3">

                <h2 className="text-2xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <span className="rounded-full bg-[#f8ebe7] px-3 py-1 text-xs font-semibold text-[#b97970]">
                  {totalItems} items
                </span>

              </div>

              {/* Summary Details */}
              <div className="mt-7 space-y-4">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-gray-900">
                    ${total.toFixed(2)}
                  </span>

                </div>

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span className="font-medium text-green-600">
                    Free
                  </span>

                </div>

              </div>

              {/* Divider */}
              <div className="my-6 border-t border-[#eee2df]" />

              {/* Total */}
              <div className="flex items-center justify-between">

                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-[#b97970]">
                  ${total.toFixed(2)}
                </span>

              </div>

              {/* Checkout */}
              <button
                type="button"
                onClick={() =>
                  router.push("/checkout")
                }
                className="mt-7 w-full rounded-full bg-[#b97970] py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#a9675f]"
              >
                Proceed to Checkout
              </button>

              {/* Security Message */}
              <div className="mt-5 rounded-2xl bg-[#fffaf8] p-4 text-center">

                <p className="text-xs leading-5 text-gray-500">
                  ✨ Your skincare essentials are almost yours.
                </p>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}
