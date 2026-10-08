"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "../redux/slices/authSlice";
import { fetchCart } from "../redux/slices/cartSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth?.user);

  const cart = useSelector((state) => state.cart?.cart);

  const cartItems = cart?.items || [];

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());

    setMenuOpen(false);

    router.push("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }

    return pathname?.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🌸</span>

          <span className="text-xl font-bold text-gray-800">
            Souq
          </span>
        </Link>

        {/* =========================
            DESKTOP MENU
        ========================= */}

        <div className="hidden items-center gap-6 md:flex">

          <Link
            href="/"
            className={`font-medium transition ${
              isActive("/")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Home
          </Link>

          <Link
            href="/products"
            className={`font-medium transition ${
              isActive("/products")
                ? "text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            Products
          </Link>

          {user && (
            <>
              <Link
                href="/cart"
                className={`relative font-medium transition ${
                  isActive("/cart")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Cart

                {cartCount > 0 && (
                  <span className="absolute -right-5 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/orders"
                className={`font-medium transition ${
                  isActive("/orders")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Orders
              </Link>
            </>
          )}

          {/* =========================
              SELLER
          ========================= */}

          {user?.role === "seller" && (
            <Link
              href="/seller/products"
              className={`font-medium transition ${
                isActive("/seller")
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Seller
            </Link>
          )}

          {/* =========================
              ADMIN
          ========================= */}

          {user?.role === "admin" && (
            <>
              <Link
                href="/admin/orders"
                className={`font-medium transition ${
                  isActive("/admin/orders")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Admin Orders
              </Link>

              <Link
                href="/admin/categories"
                className={`font-medium transition ${
                  isActive("/admin/categories")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Categories
              </Link>
            </>
          )}
        </div>

        {/* =========================
            DESKTOP AUTH
        ========================= */}

        <div className="hidden items-center gap-3 md:flex">

          {user ? (
            <>
              <span className="max-w-32 truncate text-sm font-medium text-gray-600">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* =========================
            MOBILE BUTTON
        ========================= */}

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-5 pt-3 md:hidden">

          <div className="flex flex-col gap-2">

            <Link
              href="/"
              onClick={closeMenu}
              className={`rounded-lg px-3 py-3 font-medium ${
                isActive("/")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>

            <Link
              href="/products"
              onClick={closeMenu}
              className={`rounded-lg px-3 py-3 font-medium ${
                isActive("/products")
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Products
            </Link>

            {user && (
              <>
                <Link
                  href="/cart"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-lg px-3 py-3 font-medium ${
                    isActive("/cart")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>Cart</span>

                  {cartCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  href="/orders"
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-3 font-medium ${
                    isActive("/orders")
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Orders
                </Link>
              </>
            )}

            {user?.role === "seller" && (
              <Link
                href="/seller/products"
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                Seller Products
              </Link>
            )}

            {user?.role === "admin" && (
              <>
                <Link
                  href="/admin/orders"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Admin Orders
                </Link>

                <Link
                  href="/admin/categories"
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Categories
                </Link>
              </>
            )}

            <div className="my-2 border-t border-gray-200" />

            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="flex-1 rounded-lg border border-blue-600 px-4 py-3 text-center font-semibold text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}