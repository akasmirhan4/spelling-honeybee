"use client";

import { BarChartBig } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import LeaderboardTable from "./LeaderboardTable";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LeaderboardTableSkeleton } from "./LeaderboardTableSkeleton";

export default function LeaderboardButton({}) {
  const gameVersion = useSearchParams().get("NYT") === "true" ? "NYT" : "AK";
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {}} variant="ghost">
          <BarChartBig size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[48em]">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription>
            See how you stack up against other players!
          </DialogDescription>
        </DialogHeader>
        <Suspense fallback={<LeaderboardTableSkeleton />}>
          <LeaderboardTable gameVersion={gameVersion} />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
