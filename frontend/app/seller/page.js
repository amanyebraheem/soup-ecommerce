"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { apiRequest } from "../lib/api";
import { fetchCategories } from "../redux/slices/categorySlice";

export default function SellerProductsPage() {
const router = useRouter();
const dispatch = useDispatch();

const { user, loading: authLoading } = useSelector(
(state) => state.auth
);

const {
categories = [],
loading: categoriesLoading,
} = useSelector((state) => state.categories);

const [products, setProducts] = useState([]);
const [loadingProducts, setLoadingProducts] = useState(true);

const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const [editingId, setEditingId] = useState(null);
const [saving, setSaving] = useState(false);

const [form, setForm] = useState({
name: "",
description: "",
price: "",
stock: "",
category: "",
image: "",
});

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
// Load Categories
// =========================

useEffect(() => {
if (user?.role === "seller") {
dispatch(fetchCategories());
}
}, [dispatch, user]);

// =========================
// Load Seller Products
// =========================

const loadProducts = async () => {
try {
setLoadingProducts(true);
setError("");

  const data = await apiRequest("/products/seller/me");

  setProducts(data.products || []);
} catch (err) {
  setError(
    err.message || "Failed to load products"
  );
} finally {
  setLoadingProducts(false);
}


};

useEffect(() => {
if (user?.role === "seller") {
loadProducts();
}
}, [user]);

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
// Handle Input
// =========================

const handleChange = (e) => {
const { name, value } = e.target;

setForm((prev) => ({
  ...prev,
  [name]: value,
}));


};

// =========================
// Reset
// =========================

const resetForm = () => {
setForm({
name: "",
description: "",
price: "",
stock: "",
category: "",
image: "",
});

setEditingId(null);


};

// =========================
// Edit
// =========================

const handleEdit = (product) => {
setEditingId(product._id);

setForm({
  name: product.name || "",
  description: product.description || "",
  price: product.price || "",
  stock: product.stock || "",
  category:
    product.category?._id ||
    product.category ||
    "",
  image: product.image || "",
});

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

// =========================
// Update
// =========================

const handleUpdate = async (e) => {
e.preventDefault();

if (!editingId) return;

setSaving(true);
setError("");
setSuccess("");

try {
  const payload = {
    name: form.name,
    description: form.description,
    price: Number(form.price),
    stock: Number(form.stock),
    category: form.category,
    image: form.image,
  };

  await apiRequest(`/products/${editingId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  setSuccess(
    "Product updated successfully."
  );

  resetForm();

  await loadProducts();
} catch (err) {
  setError(
    err.message || "Failed to update product"
  );
} finally {
  setSaving(false);
}


};

// =========================
// Delete
// =========================

const handleDelete = async (id) => {
const confirmed = window.confirm(
"Are you sure you want to delete this product?"
);

if (!confirmed) return;

try {
  setError("");
  setSuccess("");

  await apiRequest(`/products/${id}`, {
    method: "DELETE",
  });

  setSuccess(
    "Product deleted successfully."
  );

  await loadProducts();
} catch (err) {
  setError(
    err.message || "Failed to delete product"
  );
}


};

// =========================
// Loading
// =========================

if (authLoading || !user) {
return (
<main className="min-h-screen bg-[#fffaf8] px-6 py-12">
<div className="mx-auto max-w-7xl">
<p className="text-gray-500">
Loading...
</p>
</div>
</main>
);
}

if (user.role !== "seller") {
return null;
}

return (
<main className="min-h-screen bg-[#fffaf8] px-4 py-10 sm:px-6">

  <div className="mx-auto max-w-7xl">

    {/* Header */}

    <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97970]">
          Seller Dashboard
        </p>

        <h1 className="mt-2 text-4xl font-black text-gray-900">
          My Products
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your skincare products.
        </p>
      </div>

      <button
        onClick={() =>
          router.push("/seller/products/new")
        }
        className="rounded-full bg-[#b97970] px-6 py-3 font-semibold text-white transition hover:bg-[#a9675f]"
      >
        + Add Product
      </button>

    </div>

    {/* Error */}

    {error && (
      <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
        {error}
      </div>
    )}

    {/* Success */}

    {success && (
      <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
        {success}
      </div>
    )}

    {/* Edit Form */}

    {editingId && (
      <section className="mb-10 rounded-3xl border border-[#f0e2de] bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Edit Product
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update your product information.
          </p>
        </div>

        <form
          onSubmit={handleUpdate}
          className="space-y-5"
        >

          {/* Name */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
            />
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
            />
          </div>

          {/* Price / Stock */}

          <div className="grid gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Price
              </label>

              <input
                type="number"
                min="0"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Stock
              </label>

              <input
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
              />
            </div>

          </div>

          {/* Image */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Image
            </label>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              required
              placeholder="/uploads/product.jpg"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#b97970]"
            />
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              disabled={categoriesLoading}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
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

          {/* Buttons */}

          <div className="flex gap-3">

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#b97970] px-7 py-3 font-semibold text-white disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Update Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-gray-300 px-7 py-3 font-semibold"
            >
              Cancel
            </button>

          </div>

        </form>

      </section>
    )}

    {/* Products */}

    {loadingProducts ? (

      <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <p className="text-gray-500">
          Loading products...
        </p>
      </div>

    ) : products.length === 0 ? (

      <div className="rounded-3xl bg-white p-12 text-center shadow-sm">

        <div className="text-6xl">
          🧴
        </div>

        <h2 className="mt-4 text-2xl font-bold">
          No Products Yet
        </h2>

        <p className="mt-2 text-gray-500">
          Add your first skincare product.
        </p>

        <button
          onClick={() =>
            router.push("/seller/products/new")
          }
          className="mt-6 rounded-full bg-[#b97970] px-6 py-3 font-semibold text-white"
        >
          Add Product
        </button>

      </div>

    ) : (

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        {products.map((product) => {

          const imageUrl =
            getImageUrl(product.image);

          return (
            <div
              key={product._id}
              className="overflow-hidden rounded-3xl border border-[#f0e2de] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Image */}

              <div className="h-64 bg-[#f8ebe7]">

                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "/no-image.png";
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

              </div>

              {/* Info */}

              <div className="p-5">

                <h3 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-xl font-bold text-[#b97970]">
                    ${product.price}
                  </span>

                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>

                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Category:{" "}
                  {product.category?.name ||
                    "Unknown"}
                </p>

                {/* Actions */}

                <div className="mt-5 flex gap-3">

                  <button
                    onClick={() =>
                      handleEdit(product)
                    }
                    className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-semibold hover:bg-gray-50"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product._id)
                    }
                    className="flex-1 rounded-full bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Delete
                  </button>

                </div>

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