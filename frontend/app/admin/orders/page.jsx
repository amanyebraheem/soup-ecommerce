"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "../../lib/api";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        // لو مفيش Login
        if (!token) {
          router.push("/login");
          return;
        }

        setLoading(true);
        setError("");

        // مهم جدًا:
        // المستخدم العادي يستخدم /orders/me
        // وليس /orders
        const data = await apiRequest("/orders/me");

        console.log("MY ORDERS RESPONSE:", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data?.orders)) {
          setOrders(data.orders);
        } else if (Array.isArray(data?.data)) {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Get orders error:", error);

        setError(
          error?.message ||
            "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [router]);

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-5xl">
              📦
            </div>

            <p className="text-xl font-semibold text-gray-600">
              Loading orders...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View your previous orders and their details.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* No Orders */}
        {!error && orders.length === 0 && (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No Orders Yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't placed any orders yet.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/products")
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-800"
            >
              Start Shopping
            </button>

          </div>
        )}

        {/* Orders */}
        {!error && orders.length > 0 && (
          <div className="space-y-6">

            {orders.map((order, index) => {

              const orderId =
                order?._id ||
                order?.id ||
                `order-${index}`;

              const orderItems =
                Array.isArray(order?.items)
                  ? order.items
                  : [];

              const orderTotal =
                Number(order?.total) || 0;

              const status =
                order?.status || "pending";

              return (
                <div
                  key={orderId}
                  className="rounded-2xl border bg-white p-6 shadow-sm"
                >

                  {/* Order Header */}
                  <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h2 className="text-lg font-black text-gray-900">
                        Order #
                        {String(orderId).slice(-8)}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {formatDate(
                          order?.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">

                      <span
                        className={
                          "rounded-full px-4 py-2 text-sm font-bold " +
                          getStatusClass(status)
                        }
                      >
                        {status}
                      </span>

                      <span className="text-lg font-black text-blue-600">
                        $
                        {orderTotal.toFixed(2)}
                      </span>

                    </div>
                  </div>

                  {/* Products */}
                  <div className="mt-5">

                    <h3 className="mb-4 text-lg font-bold text-gray-800">
                      Products
                    </h3>

                    {orderItems.length === 0 ? (
                      <p className="text-gray-500">
                        No products found in this order.
                      </p>
                    ) : (
                      <div className="space-y-3">

                        {orderItems.map(
                          (item, itemIndex) => {

                            const product =
                              item?.product || {};

                            const productName =
                              product?.name ||
                              item?.name ||
                              "Product";

                            const quantity =
                              Number(
                                item?.quantity
                              ) || 1;

                            const price =
                              Number(
                                item?.price
                              ) ||
                              Number(
                                product?.price
                              ) ||
                              0;

                            return (
                              <div
                                key={
                                  item?._id ||
                                  `item-${itemIndex}`
                                }
                                className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                              >

                                <div>
                                  <p className="font-bold text-gray-800">
                                    {productName}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    Quantity:{" "}
                                    {quantity}
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    Price: $
                                    {price.toFixed(2)}
                                  </p>
                                </div>

                                <p className="font-bold text-blue-600">
                                  $
                                  {(
                                    price *
                                    quantity
                                  ).toFixed(2)}
                                </p>

                              </div>
                            );
                          }
                        )}

                      </div>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}