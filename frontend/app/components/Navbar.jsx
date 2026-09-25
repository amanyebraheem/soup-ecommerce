"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../redux/slices/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const cart = useSelector((state) => state.cart.cart);

  const cartCount =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  return (
    <nav className="sticky top-0 z-50 border-b border-[#f0e2de] bg-[#fffaf8]/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">

        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5dfda]">
            <span className="text-lg">🌸</span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-wide text-[#9e625a]">
              Glow
            </h1>

            <p className="hidden text-[9px] font-medium uppercase tracking-[0.25em] text-gray-400 sm:block">
              Skincare
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-3 sm:gap-5">

          <Link
            href="/"
            className="hidden text-sm font-medium text-gray-600 transition hover:text-[#b97970] md:block"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="text-sm font-medium text-gray-600 transition hover:text-[#b97970]"
          >
            Products
          </Link>

          {user && (
            <Link
              href="/cart"
              className="relative text-sm font-medium text-gray-600 transition hover:text-[#b97970]"
            >
              Cart

              {cartCount > 0 && (
                <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#b97970] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user && (
            <Link
              href="/orders"
              className="hidden text-sm font-medium text-gray-600 transition hover:text-[#b97970] sm:block"
            >
              Orders
            </Link>
          )}

          {/* Seller */}
          {user?.role === "seller" && (
            <Link
              href="/seller/products"
              className="rounded-full bg-[#eee1f5] px-3 py-2 text-xs font-semibold text-[#76538c] transition hover:bg-[#e5d4ef]"
            >
              Seller
            </Link>
          )}

          {/* Admin */}
          {user?.role === "admin" && (
            <div className="flex items-center gap-2">

              <Link
                href="/admin/orders"
                className="rounded-full bg-[#fce4e4] px-3 py-2 text-xs font-semibold text-[#a64b4b] transition hover:bg-[#f8d7d7]"
              >
                Admin Orders
              </Link>

              <Link
                href="/admin/categories"
                className="hidden rounded-full bg-[#f9ecd8] px-3 py-2 text-xs font-semibold text-[#a06d2d] transition hover:bg-[#f5e3c5] sm:block"
              >
                Categories
              </Link>

            </div>
          )}

          {/* Auth */}
          {!user ? (
            <div className="flex items-center gap-2">

              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-[#a96860] transition hover:bg-[#f8ebe7]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-[#b97970] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#a9675f]"
              >
                Register
              </Link>

            </div>
          ) : (
            <div className="flex items-center gap-3">

              <div className="hidden text-right md:block">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Welcome
                </p>

                <p className="max-w-28 truncate text-sm font-semibold text-gray-700">
                  {user.name}
                </p>
              </div>

              <button
                onClick={() => dispatch(logout())}
                className="rounded-full border border-[#e9c9c3] px-4 py-2 text-sm font-semibold text-[#a96860] transition hover:bg-[#f8ebe7]"
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}
