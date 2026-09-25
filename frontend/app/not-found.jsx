import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-gray-50 px-6">

      <div className="text-center">

        <p className="text-8xl font-bold text-blue-600">
          404
        </p>

        <h1 className="mt-5 text-3xl font-bold">
          Page Not Found
        </h1>

        <p className="mt-3 text-gray-500">
          The page you are looking for does not exist.
        </p>

        <Link
          href="/"
          className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
        >
          Back Home
        </Link>

      </div>

    </main>
  );
}