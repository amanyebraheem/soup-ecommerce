import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-[#fffaf8] text-gray-900">

      {/* Hero */}
      <section className="overflow-hidden bg-[#f8ebe7] px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">

          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#b97970]">
              Beauty • Care • Glow
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Your skin deserves
              <span className="block text-[#b97970]">
                the best care.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Discover carefully crafted skincare products designed
              to hydrate, nourish, and enhance your natural glow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-[#b97970] px-8 py-3.5 font-semibold text-white transition hover:bg-[#a9675f]"
              >
                Shop Now
              </Link>

              <Link
                href="/products"
                className="rounded-full border border-[#b97970] px-8 py-3.5 font-semibold text-[#b97970] transition hover:bg-white"
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* Hero Product */}
          <div className="relative flex justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-[#efd3cc] blur-3xl md:h-96 md:w-96" />

            <div className="relative flex h-96 w-80 items-center justify-center rounded-[2rem] bg-gradient-to-br from-[#fff] to-[#efd8d2] shadow-2xl">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-48 w-28 items-center justify-center rounded-b-3xl rounded-t-xl bg-white shadow-xl">
                  <div>
                    <p className="text-xs tracking-[0.3em] text-[#b97970]">
                      GLOW
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      SKIN
                    </p>
                    <div className="mx-auto mt-3 h-px w-10 bg-[#b97970]" />
                    <p className="mt-3 text-[9px] tracking-widest text-gray-400">
                      SERUM
                    </p>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-500">
                  Premium Skincare
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97970]">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Simple care. Beautiful skin.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Everything your skincare routine needs, carefully selected
              for a healthy and radiant-looking complexion.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-[#f0e2de] bg-[#fffaf8] p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5dfda] text-3xl">
                💧
              </div>

              <h3 className="mb-3 text-xl font-bold">
                Deep Hydration
              </h3>

              <p className="leading-7 text-gray-500">
                Help keep your skin feeling soft, fresh, and beautifully hydrated.
              </p>
            </div>

            <div className="rounded-2xl border border-[#f0e2de] bg-[#fffaf8] p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5dfda] text-3xl">
                ✨
              </div>

              <h3 className="mb-3 text-xl font-bold">
                Natural Glow
              </h3>

              <p className="leading-7 text-gray-500">
                Discover products made to complement your routine and enhance your glow.
              </p>
            </div>

            <div className="rounded-2xl border border-[#f0e2de] bg-[#fffaf8] p-8 text-center transition hover:-translate-y-1 hover:shadow-lg">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5dfda] text-3xl">
                🌸
              </div>

              <h3 className="mb-3 text-xl font-bold">
                Gentle Care
              </h3>

              <p className="leading-7 text-gray-500">
                Build a simple skincare routine with products selected with care.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#f8ebe7] px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b97970]">
                Our Collection
              </p>

              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                Skincare essentials
              </h2>
            </div>

            <Link
              href="/products"
              className="font-semibold text-[#b97970] hover:underline"
            >
              View All Products →
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex h-64 items-center justify-center bg-[#f5e4df]">
                <div className="flex h-40 w-24 items-center justify-center rounded-b-2xl rounded-t-lg bg-white shadow-lg">
                  <div className="text-center">
                    <p className="text-xs tracking-widest text-[#b97970]">
                      GLOW
                    </p>
                    <p className="mt-2 text-xs font-bold">
                      CREAM
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">
                  Glow Radiance Cream
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Nourishing daily moisturizer for soft, radiant-looking skin.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-block text-sm font-semibold text-[#b97970]"
                >
                  Discover Product →
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex h-64 items-center justify-center bg-[#eee4df]">
                <div className="flex h-44 w-24 items-center justify-center rounded-b-2xl rounded-t-lg bg-[#f7f1ed] shadow-lg">
                  <div className="text-center">
                    <p className="text-xs tracking-widest text-[#b97970]">
                      HYDRA
                    </p>
                    <p className="mt-2 text-xs font-bold">
                      SERUM
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">
                  Hydra Glow Serum
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Lightweight hydration for fresh and healthy-looking skin.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-block text-sm font-semibold text-[#b97970]"
                >
                  Discover Product →
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex h-64 items-center justify-center bg-[#f2e7e1]">
                <div className="flex h-40 w-28 items-center justify-center rounded-2xl bg-[#fffaf7] shadow-lg">
                  <div className="text-center">
                    <p className="text-xs tracking-widest text-[#b97970]">
                      PURE
                    </p>
                    <p className="mt-2 text-xs font-bold">
                      SKIN
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold">
                  Pure Skin Repair Cream
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  A soothing cream designed for a comfortable skincare routine.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-block text-sm font-semibold text-[#b97970]"
                >
                  Discover Product →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#b97970] px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">

          <h2 className="text-3xl font-bold md:text-5xl">
            Make skincare a moment you love.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
            Find your new skincare favorites and create a routine
            that feels as good as it looks.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 font-semibold text-[#b97970] transition hover:bg-gray-100"
          >
            Shop Collection
          </Link>

        </div>
      </section>

    </main>
  );
}
