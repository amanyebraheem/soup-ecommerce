"use client";

import { useEffect, useState } from "react";
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

  const { cart } = useSelector(
    (state) => state.cart
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    dispatch(fetchCart());
  }, [user, dispatch, router]);

  const items = cart?.items || [];

  const total = items.reduce(
    (sum, item) =>
      sum +
      (item.product?.price || 0) *
        item.quantity,
    0
  );

  const handleOrder = async () => {
    try {
      setLoading(true);
      setError("");

      await apiRequest("/orders", {
        method: "POST",
      });

      router.push("/orders");

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-4xl">

        <h1 className="mb-8 text-4xl font-bold">
          Checkout
        </h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-white p-8 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">
            Order Summary
          </h2>

          <div className="space-y-4">

            {items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-4"
              >
                <div>
                  <p className="font-semibold">
                    {item.product?.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  $
                  {(
                    item.product?.price *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            ))}

          </div>

          <div className="mt-8 flex justify-between border-t pt-6">

            <span className="text-2xl font-bold">
              Total
            </span>

            <span className="text-2xl font-bold text-blue-600">
              ${total.toFixed(2)}
            </span>

          </div>

          <button
            onClick={handleOrder}
            disabled={
              loading || items.length === 0
            }
            className="mt-8 w-full rounded-lg bg-green-600 py-4 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading
              ? "Creating Order..."
              : "Confirm Order"}
          </button>

        </div>

      </div>

    </main>
  );
}