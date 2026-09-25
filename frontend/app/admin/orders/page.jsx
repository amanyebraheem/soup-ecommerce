"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { apiRequest } from "../../lib/api";

export default function AdminOrdersPage() {
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

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    loadOrders();
  }, [user, router]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/orders");

      setOrders(data.orders);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(
       `/orders/${id}/status`,

        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      await loadOrders();

    } catch (error) {
      setError(error.message);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            ADMIN DASHBOARD
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            All Orders
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading orders...
            </p>
          ) : orders.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="space-y-5">

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border p-5"
                >

                  <div className="mb-5 flex flex-col justify-between gap-4 border-b pb-5 md:flex-row">

                    <div>
                      <p className="text-sm text-gray-500">
                        Order
                      </p>

                      <p className="font-mono text-sm">
                        {order._id}
                      </p>

                      {order.user && (
                        <p className="mt-2 text-sm text-gray-500">
                          Customer:{" "}
                          {order.user.name ||
                            order.user.email}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">

                      <span className="font-bold">
                        ${order.total?.toFixed(2)}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="rounded-lg border px-3 py-2"
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>
                      </select>

                    </div>

                  </div>

                  <div className="space-y-3">

                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex justify-between"
                        >
                          <span>
                            {item.product?.name ||
                              "Product"}{" "}
                            × {item.quantity}
                          </span>

                          <span>
                            $
                            {(
                              item.price *
                              item.quantity
                            ).toFixed(2)}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}