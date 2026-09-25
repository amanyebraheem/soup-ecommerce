"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { apiRequest } from "../../lib/api";

export default function AdminCategoriesPage() {
  const router = useRouter();

  const { user } = useSelector(
    (state) => state.auth
  );

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

    loadCategories();
  }, [user, router]);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/categories");

      setCategories(data.categories);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name,
        description: form.description,
      };

      if (editingId) {
        await apiRequest(
          /categories/${editingId},
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );
      } else {
        await apiRequest("/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      setForm({
        name: "",
        description: "",
      });

      setEditingId(null);

      await loadCategories();

    } catch (error) {
      setError(error.message);

    } finally {
      setSaving(false);
    }
  };

  const editCategory = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name,
      description: category.description || "",
    });
  };

  const deleteCategory = async (id) => {
    if (
      !window.confirm(
        "Delete this category?"
      )
    ) {
      return;
    }

    try {
      await apiRequest(
        /categories/${id},
        {
          method: "DELETE",
        }
      );

      await loadCategories();

    } catch (error) {
      setError(error.message);
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">

      <div className="mx-auto max-w-5xl">

        <div className="mb-8">

          <p className="text-sm font-semibold text-blue-600">
            ADMIN DASHBOARD
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Categories
          </h1>

        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-2xl font-bold">
            {editingId
              ? "Edit Category"
              : "Add Category"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Category name"
              className="w-full rounded-lg border px-4 py-3"
            />

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              placeholder="Description"
              rows={3}
              className="w-full rounded-lg border px-4 py-3"
            />

            <div className="flex gap-3">

              <button
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update"
                  : "Add Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      name: "",
                      description: "",
                    });
                  }}
                  className="rounded-lg border px-6 py-3"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-2xl font-bold">
            All Categories
          </h2>

          {loading ? (
            <p className="text-gray-500">
              Loading...
            </p>
          ) : (
            <div className="space-y-3">

              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-center"
                >

                  <div>
                    <h3 className="font-bold">
                      {category.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        editCategory(category)
                      }
                      className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCategory(
                          category._id
                        )
                      }
                      className="rounded-lg bg-red-100 px-4 py-2 text-red-700"
                    >
                      Delete
                    </button>

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