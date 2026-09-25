"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";

export default function OrdersPage() {
  const router = useRouter();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const getOrders = async () => {
      try {
        const data = await apiRequest("/orders/me");

        setOrders(data.orders);

      } catch (error) {
        setError(error.message);

      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-6xl">

        <h1 className="mb-8 text-4xl font-bold">
          My Orders
        </h1>

        {loading && (
          <p className="py-10 text-center text-gray-500">
            Loading orders...
          </p>
        )}

        {error && (
          <div className="rounded-lg bg-red-100 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading &&
          !error &&
          orders.length === 0 && (
            <div className="rounded-xl bg-white p-10 text-center">
              <p className="text-xl text-gray-500">
                You don't have any orders yet.
              </p>
            </div>
          )}

        <div className="space-y-5">

          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >

              <div className="mb-5 flex flex-col justify-between gap-3 border-b pb-5 md:flex-row">

                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <p className="font-mono text-sm">
                    {order._id}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                    order.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>

              </div>

              <div className="space-y-3">

                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between"
                  >

                    <div>
                      <p className="font-medium">
                        {item.product?.name ||
                          "Product"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      $
                      {(
                        item.price *
                        item.quantity
                      ).toFixed(2)}
                    </p>

                  </div>
                ))}

              </div>

              <div className="mt-5 flex justify-between border-t pt-5">

                <span className="font-bold">
                  Total
                </span>

                <span className="text-xl font-bold text-blue-600">
                  ${order.total.toFixed(2)}
                </span>

              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}