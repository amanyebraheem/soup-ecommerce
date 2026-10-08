"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCart,
  removeFromCart,
} from "../redux/slices/cartSlice";

const BACKEND_URL = "http://localhost:5000";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector(
    (state) => state.cart
  );

  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, router]);

  const cartItems = useMemo(() => {
    if (!cart) {
      return [];
    }

    if (Array.isArray(cart)) {
      return cart;
    }

    if (Array.isArray(cart.items)) {
      return cart.items;
    }

    if (Array.isArray(cart.cartItems)) {
      return cart.cartItems;
    }

    return [];
  }, [cart]);

  const getProduct = (item) => {
    if (!item) {
      return null;
    }

    return item.product || item.productId || item;
  };

  const getQuantity = (item) => {
    return Number(item.quantity || item.qty || 1);
  };

  const getPrice = (item) => {
    const product = getProduct(item);

    return Number(
      product?.price ||
      item.price ||
      0
    );
  };

  const getImage = (item) => {
    const product = getProduct(item);

    const image =
      product?.image ||
      item.image ||
      "";

    if (!image) {
      return "/no-image.png";
    }

    if (image.startsWith("http")) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return BACKEND_URL + image;
    }

    return image;
  };

  const getName = (item) => {
    const product = getProduct(item);

    return (
      product?.name ||
      item.name ||
      "Product"
    );
  };

  const subtotal = cartItems.reduce(
    (total, item) => {
      return (
        total +
        getPrice(item) *
          getQuantity(item)
      );
    },
    0
  );

  const shipping = subtotal > 0 ? 0 : 0;

  const tax = subtotal * 0.14;

  const total =
    subtotal +
    shipping +
    tax;

  const handleRemove = async (item) => {
    /*
      مهم:
      هنا نستخدم _id الخاص بعنصر السلة نفسه.
      وليس product._id.
    */

    const itemId = item?._id;

    console.log("CART ITEM:", item);
    console.log("CART ITEM ID:", itemId);

    if (!itemId) {
      setMessage("Cart item ID is missing");
      return;
    }

    try {
      setMessage("");

      await dispatch(
        removeFromCart(itemId)
      ).unwrap();

      await dispatch(
        fetchCart()
      ).unwrap();

      setMessage(
        "Product removed successfully"
      );
    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );

      setMessage(
        typeof error === "string"
          ? error
          : error?.message ||
            "Failed to remove product"
      );
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    router.push("/checkout");
  };

  if (loading && !cart) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center">
          <p className="text-xl font-semibold text-gray-600">
            Loading cart...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Shopping Cart
          </h1>

          <p className="mt-2 text-gray-500">
            Review your products before checkout.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600">
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              🛒
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              You don't have any products in your cart.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/products")
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
            >
              Continue Shopping
            </button>

          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

            <div className="space-y-4">

              {cartItems.map(
                (item, index) => {
                  const product =
                    getProduct(item);

                  const itemId =
                    item?._id ||
                    "cart-item-" + index;

                  const price =
                    getPrice(item);

                  const quantity =
                    getQuantity(item);

                  return (
                    <div
                      key={itemId}
                      className="flex flex-col gap-5 rounded-2xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                    >

                      <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:w-32">

                        <img
                          src={getImage(item)}
                          alt={getName(item)}
                          className="h-full w-full object-contain"
                          onError={(event) => {
                            event.currentTarget.src =
                              "/no-image.png";
                          }}
                        />

                      </div>

                      <div className="flex-1">

                        <h2 className="text-lg font-bold text-gray-900">
                          {getName(item)}
                        </h2>

                        <p className="mt-2 text-lg font-bold text-blue-600">
                          $
                          {price.toFixed(2)}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {quantity}
                        </p>

                        <p className="mt-2 font-semibold text-gray-800">
                          Item Total: $
                          {(
                            price *
                            quantity
                          ).toFixed(2)}
                        </p>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleRemove(item)
                        }
                        disabled={loading}
                        className="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading
                          ? "Removing..."
                          : "Remove"}
                      </button>

                    </div>
                  );
                }
              )}

            </div>

            <div className="h-fit rounded-2xl border bg-white p-6 shadow-sm">

              <h2 className="text-xl font-black text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>

                  <span>
                    {shipping === 0
                      ? "Free"
                      : "$" +
                        shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>

                  <span>
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="border-t pt-4">

                  <div className="flex justify-between text-xl font-black">

                    <span>
                      Total
                    </span>

                    <span className="text-blue-600">
                      ${total.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-6 w-full rounded-xl bg-black py-4 font-bold text-white hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/products")
                }
                className="mt-3 w-full rounded-xl border py-3 font-semibold hover:bg-gray-50"
              >
                Continue Shopping
              </button>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}