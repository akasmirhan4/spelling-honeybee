"use client";

import { LucideShare2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({}) {
  return (
    <button
      className="flex h-full items-center px-2 text-xs font-bold transition-all ease-in-out active:bg-primary/50 md:hover:bg-primary/50"
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
    </button>
  );
}
