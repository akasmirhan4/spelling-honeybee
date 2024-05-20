"use client"

import { LucideShare2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({}) {
  return (
    <button
      className="flex h-full items-center px-2 text-xs font-bold md:hover:bg-primary/50 active:bg-primary/50 ease-in-out transition-all"
      onClick={() => {
        navigator.clipboard.writeText("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
        toast.success("Results copied!", {
            position: "bottom-center",
        })
      }}
    >
      <LucideShare2 size={24} />
    </button>
  );
}
