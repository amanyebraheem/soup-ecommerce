"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiRequest } from "../lib/api";

const BACKEND_URL = "http://localhost:5000";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrders = async () => {
      const token =
        localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest("/orders");

        console.log(
          "Orders response:",
          response
        );

        if (Array.isArray(response)) {
          setOrders(response);
        } else if (
          Array.isArray(response.orders)
        ) {
          setOrders(response.orders);
        } else if (
          Array.isArray(response.data)
        ) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error(
          "Get orders error:",
          error
        );

        setError(
          error?.message ||
            "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [router]);

  const getOrderId = (order) => {
    return (
      order._id ||
      order.id ||
      "unknown"
    );
  };

  const getOrderStatus = (order) => {
    return (
      order.status ||
      order.orderStatus ||
      "Pending"
    );
  };

  const getOrderItems = (order) => {
    if (Array.isArray(order.items)) {
      return order.items;
    }

    if (
      Array.isArray(
        order.orderItems
      )
    ) {
      return order.orderItems;
    }

    return [];
  };

  const getItemName = (item) => {
    const product =
      item.product ||
      item.productId ||
      item;

    return (
      product?.name ||
      item.name ||
      "Product"
    );
  };

  const getItemPrice = (item) => {
    const product =
      item.product ||
      item.productId ||
      item;

    return Number(
      product?.price ||
      item.price ||
      0
    );
  };

  const getItemQuantity = (item) => {
    return Number(
      item.quantity ||
      item.qty ||
      1
    );
  };

  const getItemImage = (item) => {
    const product =
      item.product ||
      item.productId ||
      item;

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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-xl font-semibold text-gray-600">
            Loading orders...
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
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View all your previous orders.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 font-semibold text-red-600">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-3xl border bg-white p-12 text-center shadow-sm">

            <div className="mb-4 text-6xl">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Your orders will appear here after checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/products")
              }
              className="mt-6 rounded-xl bg-black px-6 py-3 font-bold text-white hover:bg-gray-800"
            >
              Start Shopping
            </button>

          </div>
        ) : (
          <div className="space-y-6">

            {orders.map((order) => {
              const items =
                getOrderItems(order);

              const total = Number(
                order.total ||
                  order.totalPrice ||
                  order.amount ||
                  0
              );

              return (
                <div
                  key={getOrderId(order)}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                >

                  <div className="flex flex-col gap-4 border-b bg-gray-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <p className="font-bold text-gray-900">
                        {getOrderId(order)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Date
                      </p>

                      <p className="font-semibold text-gray-800">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Status
                      </p>

                      <span className="inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                        {getOrderStatus(
                          order
                        )}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="text-xl font-black text-blue-600">
                        ${total.toFixed(2)}
                      </p>
                    </div>

                  </div>

                  <div className="space-y-4 p-5">

                    {items.length === 0 ? (
                      <p className="text-gray-500">
                        No products found in this order.
                      </p>
                    ) : (
                      items.map(
                        (item, index) => {
                          const price =
                            getItemPrice(
                              item
                            );

                          const quantity =
                            getItemQuantity(
                              item
                            );

                          return (
                            <div
                              key={
                                item._id ||
                                item.id ||
                                index
                              }
                              className="flex items-center gap-4 rounded-xl border p-4"
                            >

                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                                <img
                                  src={getItemImage(
                                    item
                                  )}
                                  alt={getItemName(
                                    item
                                  )}
                                  className="h-full w-full object-contain"
                                  onError={(
                                    event
                                  ) => {
                                    event.currentTarget.src =
                                      "/no-image.png";
                                  }}
                                />

                              </div>

                              <div className="flex-1">

                                <h3 className="font-bold text-gray-900">
                                  {getItemName(
                                    item
                                  )}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                  Quantity:{" "}
                                  {quantity}
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
                      )
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