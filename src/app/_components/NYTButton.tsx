"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

export function NYTButton() {
  const playNYT = useSearchParams().get("NYT") === "true";

  return (
    <Button asChild variant="outline">
      <Link
        href={{
          pathname: "/play",
          query: { NYT: !playNYT },
        }}
      >
        <h1>{playNYT ? "Amirrul" : "NYT"}</h1>
      </Link>
    </Button>
  );
}
