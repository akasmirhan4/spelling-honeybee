"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";

export function WSJButton() {
  const playWSJ = useSearchParams().get("wsj") === "true";

  return (
    <Button asChild variant="outline">
      <Link
        href={{
          pathname: "/play",
          query: { wsj: !playWSJ },
        }}
      >
        <h1>{playWSJ ? "Amirrul" : "WSJ"}</h1>
      </Link>
    </Button>
  );
}
