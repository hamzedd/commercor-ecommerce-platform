"use client";

import { useEffect } from "react";
import { Link } from "@/src/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-lg font-bold text-stone-900">Something went wrong</p>
      <p className="max-w-md text-sm text-stone-600">
        We couldn&apos;t load this page. Please try again, or head back to the
        homepage.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-stone-950 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-stone-300 px-5 py-2 text-sm font-bold text-stone-900 transition-colors hover:border-stone-400"
        >
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
