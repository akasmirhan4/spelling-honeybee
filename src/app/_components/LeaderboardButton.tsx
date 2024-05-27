"use client";

import { BarChartBig } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import LeaderboardTable from "./LeaderboardTable";
import { useSearchParams } from "next/navigation";
import { Suspense, useContext } from "react";
import { LeaderboardTableSkeleton } from "./LeaderboardTableSkeleton";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInButton from "./SignInButton";
import { GameContext } from "./GameProvider";

export default function LeaderboardButton({}) {
  const gameVersion = useSearchParams().get("NYT") === "true" ? "NYT" : "AK";
  const game = useContext(GameContext);
  const gameData = gameVersion === "AK" ? game.AKGameData : game.NYTGameData;
  if (!gameData) return null;
  return (
    <Dialog>
      {/* <Tooltip> */}
      <DialogTrigger asChild>
        {/* <TooltipTrigger asChild> */}
        <Button variant="ghost">
          <BarChartBig size={24} />
        </Button>
        {/* </TooltipTrigger> */}
      </DialogTrigger>
      {/* <TooltipContent>Leaderboard</TooltipContent> */}
      {/* </Tooltip> */}
      <DialogContent className="md:min-w-[48em]" aria-modal>
        <SignedIn>
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogDescription>
              See how you stack up against other players!
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<LeaderboardTableSkeleton />}>
            <LeaderboardTable
              gameVersion={gameVersion}
              dateDisplay={gameData.displayDate}
            />
          </Suspense>
        </SignedIn>
        <SignedOut>
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogDescription>
              Sign in to see how you stack up against other players!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <SignInButton />
          </DialogFooter>
        </SignedOut>
      </DialogContent>
    </Dialog>
  );
}
