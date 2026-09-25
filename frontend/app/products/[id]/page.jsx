"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import api from "../../lib/api";
import { addToCart } from "../../redux/slices/cartSlice";

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);

                const response = await api.get("/products");

                const foundProduct =
                    response.data.products.find(
                        (item) =>
                            item._id === params.id
                    );

                if (!foundProduct) {
                    setError("Product not found");
                } else {
                    setProduct(foundProduct);
                }

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load product"
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
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const result = await dispatch(
            addToCart({
                productId: product._id,
                quantity,
            })
        );

        if (!result.error) {
            router.push("/cart");
        }
    };

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-20 text-center">
                Loading product...
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-20 text-center">
                <h1 className="text-3xl font-bold">
                    {error || "Product not found"}
                </h1>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-6xl px-4 py-12">

            <div className="grid gap-10 rounded-3xl border bg-white p-6 shadow-sm md:grid-cols-2">

                <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-gray-100">
                    <span className="text-8xl">
                        🛍️
                    </span>
                </div>

                <div className="flex flex-col justify-center">

                    <p className="mb-3 text-sm font-medium text-gray-500">
                        {product.category?.name ||
                            "Product"}
                    </p>

                    <h1 className="mb-4 text-4xl font-black">
                        {product.name}
                    </h1>

                    <p className="mb-6 text-3xl font-bold">
                        ${product.price}
                    </p>

                    <p className="mb-6 leading-7 text-gray-600">
                        {product.description}
                    </p>

                    <p className="mb-6 text-sm text-gray-500">
                        Available stock:{" "}
                        <span className="font-bold text-black">
                            {product.stock}
                        </span>
                    </p>

                    {product.stock > 0 && (
                        <div className="mb-6 flex items-center gap-4">

                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.max(
                                            1,
                                            quantity - 1
                                        )
                                    )
                                }
                                className="h-10 w-10 rounded-lg border"
                            >
                                -
                            </button>

                            <span className="font-bold">
                                {quantity}
                            </span>

                            <button
                                onClick={() =>
                                    setQuantity(
                                        Math.min(
                                            product.stock,
                                            quantity + 1
                                        )
                                    )
                                }
                                className="h-10 w-10 rounded-lg border"
                            >
                                +
                            </button>

                        </div>
                    )}

                    <button
                        disabled={product.stock === 0}
                        onClick={handleAddToCart}
                        className="rounded-xl bg-black py-4 font-bold text-white disabled:bg-gray-300"
                    >
                        {product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                    </button>

                </div>
            </div>
        </main>
    );
}