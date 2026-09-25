import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#f0e2de] bg-[#fffaf8] text-gray-700">

      <div className="mx-auto max-w-7xl px-6 py-14">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f5dfda]">
                <span className="text-xl">🌸</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold tracking-wide text-[#9e625a]">
                  Glow
                </h2>

                <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400">
                  Skincare
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-500">
              Discover beautiful skincare essentials made to
              hydrate, nourish, and enhance your natural glow.
            </p>

            <div className="mt-5 flex gap-3">

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5dfda] text-sm text-[#9e625a] transition hover:bg-[#b97970] hover:text-white"
              >
                f
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5dfda] text-sm text-[#9e625a] transition hover:bg-[#b97970] hover:text-white"
              >
                ◎
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5dfda] text-sm text-[#9e625a] transition hover:bg-[#b97970] hover:text-white"
              >
                ♡
              </a>

            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-gray-900">
              Shop
            </h3>

            <div className="mt-5 space-y-3 text-sm">

              <Link
                href="/products"
                className="block text-gray-500 transition hover:text-[#b97970]"
              >
                All Products
              </Link>

              <Link
                href="/products"
                className="block text-gray-500 transition hover:text-[#b97970]"
              >
                Creams
              </Link>

              <Link
                href="/products"
                className="block text-gray-500 transition hover:text-[#b97970]"
              >
                Serums
              </Link>

              <Link
                href="/cart"
                className="block text-gray-500 transition hover:text-[#b97970]"
              >
                Shopping Cart
              </Link>

            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-bold text-gray-900">
              Customer Care
            </h3>

            <div className="mt-5 space-y-3 text-sm">

              <Link
                href="/orders"
                className="block text-gray-500 transition hover:text-[#b97970]"
              >
                My Orders
              </Link>

              <p className="text-gray-500">
                Shipping & Delivery
              </p>

              <p className="text-gray-500">
                Returns & Refunds
              </p>

              <p className="text-gray-500">
                Contact Us
              </p>

            </div>
          </div>

          {/* Newsletter */}
          <div>

            <h3 className="font-bold text-gray-900">
              Stay in the Glow
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Subscribe to receive skincare tips, new arrivals,
              and special offers.
            </p>

            <div className="mt-5 flex overflow-hidden rounded-full border border-[#ead5d0] bg-white">

              <input
                type="email"
                placeholder="Your email"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400"
              />

              <button
                type="button"
                className="bg-[#b97970] px-5 text-sm font-semibold text-white transition hover:bg-[#a9675f]"
              >
                Join
              </button>

            </div>

          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-[#eadfdb] pt-6 text-center text-sm text-gray-400 md:flex-row md:items-center md:justify-between md:text-left">

          <p>
            © {new Date().getFullYear()} Glow Skincare. All rights reserved.
          </p>

          <div className="flex justify-center gap-5">

            <Link
              href="#"
              className="transition hover:text-[#b97970]"
            >
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="transition hover:text-[#b97970]"
            >
              Terms & Conditions
            </Link>

          </div>

        </div>

      </div>

    </footer>
  );
}
