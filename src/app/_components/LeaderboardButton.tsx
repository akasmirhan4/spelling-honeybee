"use client";

import { BarChartBig } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function LeaderboardButton({}) {
  return (
    <Button
      onClick={() => {
        // Share button logic
        // temp button, rickroll for now
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
      }}
      variant="ghost"
    >
      <BarChartBig size={24} />
    </Button>
  );
}
