"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../lib/api";




export default function AdminDashboard() {
const router = useRouter();

const [orders, setOrders] = useState([]);
const [categories, setCategories] = useState([]);

const [loading, setLoading] = useState(true);

useEffect(() => {
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    if (!user || user.role !== "admin") {
        router.push("/login");
        return;
    }

    const loadData = async () => {
        try {
            const [ordersResponse, categoriesResponse] =
                await Promise.all([
                    apiRequest("/orders"),
                    apiRequest("/categories"),
                ]);

            setOrders(
                ordersResponse.orders || []
            );

            setCategories(
                categoriesResponse.categories || []
            );

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, [router]);

const updateStatus = async (orderId, status) => {
    try {
        const response = await apiRequest(
            `/orders/${orderId}/status`,
            {
                method: "PATCH",
                body: JSON.stringify({ status }),
            }
        );

        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order._id === orderId
                    ? response.order
                    : order
            )
        );

    } catch (error) {
        alert(
            error.message ||
            "Failed to update status"
        );
    }
};

return (
    <main className="mx-auto max-w-7xl px-4 py-12">

        <div className="mb-10">
            <h1 className="text-4xl font-black">
                Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
                Manage orders and categories
            </p>
        </div>

        {loading ? (
            <div>Loading dashboard...</div>
        ) : (
            <>
                <div className="mb-10 grid gap-5 md:grid-cols-2">

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-gray-500">
                            Total Orders
                        </p>

                        <p className="mt-2 text-4xl font-black">
                            {orders.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-white p-6 shadow-sm">
                        <p className="text-gray-500">
                            Categories
                        </p>

                        <p className="mt-2 text-4xl font-black">
                            {categories.length}
                        </p>
                    </div>

                </div>

                <div className="overflow-hidden rounded-2xl border bg-white">

                    <div className="border-b p-5">
                        <h2 className="text-xl font-bold">
                            All Orders
                        </h2>
                    </div>

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4">
                                        Customer
                                    </th>

                                    <th className="p-4">
                                        Total
                                    </th>

                                    <th className="p-4">
                                        Status
                                    </th>

                                    <th className="p-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="border-t"
                                    >

                                        <td className="p-4">
                                            <p className="font-medium">
                                                {order.user?.name}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                {order.user?.email}
                                            </p>
                                        </td>

                                        <td className="p-4 font-semibold">
                                            ${order.total}
                                        </td>

                                        <td className="p-4">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm capitalize">
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="p-4">

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

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                </div>
            </>
        )}

    </main>
);


}