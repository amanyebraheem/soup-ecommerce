"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {

  const dispatch = useDispatch();

  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">
          Loading products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Products
        </h1>

        {products.length === 0 ? (
          <p className="text-gray-500">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}

          </div>
        )}

      </div>

    </main>
  );
}
