"use client";

import { BarChartBig } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function LeaderboardButton({}) {
  return (
    <Button
      onClick={() => {
        // Share button logic
      }}
      variant="ghost"
    >
      <BarChartBig size={24} />
    </Button>
  );
}
