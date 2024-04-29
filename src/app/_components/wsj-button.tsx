"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export function WSJButton() {
  const playWSJ = useSearchParams().get("wsj") === "true";

  return (
    <Suspense>
      <Link
        href={{
          pathname: "/play",
          query: { wsj: !playWSJ },
        }}
        className="flex h-full items-center px-6 text-xs font-bold hover:bg-primary/50"
      >
        <h1>{playWSJ ? "Amirrul" : "WSJ"}</h1>
      </Link>
    </Suspense>
  );
}
