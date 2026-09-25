"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { apiRequest } from "../../../../lib/api";
import { fetchCategories } from "../../../../redux/slices/categorySlice";

export default function AddProductPage() {
const router = useRouter();
const dispatch = useDispatch();

const { user, loading: authLoading } = useSelector(
(state) => state.auth
);

const {
categories = [],
loading: categoriesLoading,
} = useSelector((state) => state.categories);

const [form, setForm] = useState({
name: "",
description: "",
price: "",
stock: "",
category: "",
image: "",
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

// =========================
// Check Seller
// =========================

useEffect(() => {
if (!authLoading) {
if (!user) {
router.push("/login");
return;
}

  if (user.role !== "seller") {
    router.push("/");
  }
}


}, [user, authLoading, router]);

// =========================
// Categories
// =========================

useEffect(() => {
if (user?.role === "seller") {
dispatch(fetchCategories());
}
}, [dispatch, user]);

// =========================
// Change
// =========================

const handleChange = (e) => {
const { name, value } = e.target;

setForm((prev) => ({
  ...prev,
  [name]: value,
}));


};

// =========================
// Image URL
// =========================

const getImageUrl = (image) => {
if (!image) return null;

if (image.startsWith("http")) {
  return image;
}

return `http://localhost:5000${image}`;


};

// =========================
// Submit
// =========================

const handleSubmit = async (e) => {
e.preventDefault();

setError("");
setLoading(true);

try {
  const payload = {
    name: form.name,
    description: form.description,
    price: Number(form.price),
    stock: Number(form.stock),
    category: form.category,
    image: form.image,
  };

  await apiRequest("/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  router.push("/seller/products");

} catch (err) {
  setError(
    err.message || "Failed to create product"
  );
} finally {
  setLoading(false);
}


};

// =========================
// Loading
// =========================

if (authLoading || !user) {
return (
<main className="min-h-screen bg-[#fffaf8] px-6 py-12">
<div className="mx-auto max-w-3xl">
Loading...
</div>
</main>
);
}

if (user.role !== "seller") {
return null;
}

const previewUrl = getImageUrl(form.image);

return (
<main className="min-h-screen bg-[#fffaf8] px-4 py-10 sm:px-6">

  <div className="mx-auto max-w-3xl">

    {/* Header */}

    <div className="mb-8">

      <button
        type="button"
        onClick={() =>
          router.push("/seller/products")
        }
        className="mb-5 text-sm font-semibold text-[#b97970] hover:underline"
      >
        ← Back to My Products
      </button>

      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97970]">
        Seller Dashboard
      </p>

      <h1 className="mt-2 text-4xl font-black text-gray-900">
        Add New Product
      </h1>

      <p className="mt-2 text-gray-500">
        Add a new skincare product to your store.
      </p>

    </div>

    {/* Error */}

    {error && (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
        {error}
      </div>
    )}

    {/* Form */}

    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#f0e2de] bg-white p-6 shadow-sm sm:p-8"
    >

      {/* Product Name */}

      <div className="mb-5">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Product Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Glow Radiance Cream"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#b97970] focus:ring-2 focus:ring-[#b97970]/10"
        />

      </div>

      {/* Description */}

      <div className="mb-5">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="A nourishing cream for soft and radiant-looking skin."
          rows={5}
          required
          className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#b97970] focus:ring-2 focus:ring-[#b97970]/10"
        />

      </div>

      {/* Price / Stock */}

      <div className="mb-5 grid gap-5 md:grid-cols-2">

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Price
          </label>

          <input
            type="number"
            min="0"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="250"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
          />

        </div>

        <div>

          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Stock
          </label>

          <input
            type="number"
            min="0"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="20"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
          />

        </div>

      </div>

      {/* Category */}

      <div className="mb-5">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Category
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          disabled={categoriesLoading}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#b97970]"
        >

          <option value="">
            {categoriesLoading
              ? "Loading categories..."
              : "Select category"}
          </option>

          {categories.map((category) => (
            <option
              key={category._id}
              value={category._id}
            >
              {category.name}
            </option>
          ))}

        </select>

      </div>

      {/* Image */}

      <div className="mb-5">

        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Product Image URL
        </label>

        <input
          type="text"
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="/uploads/product.jpg"
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
        />

        <p className="mt-2 text-xs text-gray-400">
          Enter the image path or a complete image URL.
        </p>

      </div>

      {/* Preview */}

      {previewUrl && (
        <div className="mb-6">

          <p className="mb-2 text-sm font-semibold text-gray-700">
            Image Preview
          </p>

          <div className="h-64 overflow-hidden rounded-2xl bg-[#f8ebe7]">

            <img
              src={previewUrl}
              alt="Product Preview"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "/no-image.png";
              }}
            />

          </div>

        </div>
      )}

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#b97970] py-4 font-bold text-white transition hover:bg-[#a9675f] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Creating Product..."
          : "Create Product"}
      </button>

    </form>

  </div>

</main>


);
}