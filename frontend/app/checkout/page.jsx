
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { apiRequest } from "../lib/api";
import { fetchCart } from "../redux/slices/cartSlice";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector(
    (state) => state.auth
  );

  const { cart, loading: cartLoading } =
    useSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    dispatch(fetchCart());
  }, [dispatch, router]);

  const items = useMemo(() => {
    if (!cart) {
      return [];
    }

    if (Array.isArray(cart.items)) {
      return cart.items;
    }

    return [];
  }, [cart]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price =
        Number(item?.product?.price) || 0;

      const quantity =
        Number(item?.quantity) || 0;

      return sum + price * quantity;
    }, 0);
  }, [items]);

  const handleOrder = async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("Creating order...");

      const data = await apiRequest(
        "/orders",
        {
          method: "POST",
        }
      );

      console.log(
        "Order created successfully:",
        data
      );

      setSuccess(
        "Order created successfully!"
      );

      await dispatch(
        fetchCart()
      ).unwrap();

      setTimeout(() => {
        router.push("/orders");
      }, 800);

    } catch (error) {
      console.error(
        "Create order error:",
        error
      );

      setError(
        error?.message ||
          "Failed to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading && !cart) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-10">
        <div className="mx-auto flex min-h-[400px] max-w-4xl items-center justify-center">
          <p className="text-xl font-semibold text-gray-600">
            Loading checkout...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">

      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Review your order before confirming.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-semibold text-green-600">
              {success}
            </p>
          </div>
        )}

        {/* Checkout Card */}
        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">

          <h2 className="mb-6 text-2xl font-black text-gray-900">
            Order Summary
          </h2>

          {/* Empty Cart */}
          {items.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-8 text-center">

              <div className="mb-3 text-5xl">
                🛒
              </div>

              <h3 className="text-xl font-bold text-gray-800">
                Your cart is empty
              </h3>

              <p className="mt-2 text-gray-500">
                Add some products before checkout.
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
            <>
              {/* Products */}
              <div className="space-y-4">

                {items.map((item) => {
                  const product =
                    item?.product || {};

                  const name =
                    product?.name ||
                    "Product";

                  const price =
                    Number(
                      product?.price
                    ) || 0;

                  const quantity =
                    Number(
                      item?.quantity
                    ) || 0;

                  const itemTotal =
                    price * quantity;

                  return (
                    <div
                      key={item?._id}
                      className="flex flex-col gap-3 rounded-xl border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div>
                        <p className="font-bold text-gray-900">
                          {name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Quantity: {quantity}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Price: $
                          {price.toFixed(2)}
                        </p>
                      </div>

                      <p className="text-lg font-black text-blue-600">
                        $
                        {itemTotal.toFixed(2)}
                      </p>

                    </div>
                  );
                })}

              </div>

              {/* Total */}
              <div className="mt-8 flex items-center justify-between border-t pt-6">

                <span className="text-2xl font-black text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-black text-blue-600">
                  ${total.toFixed(2)}
                </span>

              </div>

              {/* Confirm Order */}
              <button
                type="button"
                onClick={handleOrder}
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-green-600 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "Creating Order..."
                  : "Confirm Order"}
              </button>

              {/* Back to Cart */}
              <button
                type="button"
                onClick={() =>
                  router.push("/cart")
                }
                disabled={loading}
                className="mt-3 w-full rounded-xl border py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Back to Cart
              </button>

            </>
          )}

        </div>

      </div>

    </main>
  );
}