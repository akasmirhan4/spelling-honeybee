"use client"

import { BarChartBig } from "lucide-react";

export default function LeaderboardButton({}) {
  return (
    <button
      className="flex h-full items-center px-2 text-xs font-bold md:hover:bg-primary/50 active:bg-primary/50 ease-in-out transition-all"
      onClick={() => {
        // Share button logic
      }}
    >
      <BarChartBig size={24} />
    </button>
  );
}
