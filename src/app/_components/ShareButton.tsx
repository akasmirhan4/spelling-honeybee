"use client";

import { LucideShare2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";

export default function ShareButton({}) {
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        await navigator.clipboard
          .writeText("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
          .then(() => {
            toast.success("Results copied!", {
              position: "bottom-center",
            });
          });
      }}
    >
      <LucideShare2 size={24} />
    </Button>
  );
}
