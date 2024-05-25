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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import LeaderboardTable from "./LeaderboardTable";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LeaderboardTableSkeleton } from "./LeaderboardTableSkeleton";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SignInButton from "./SignInButton";

export default function LeaderboardButton({}) {
  const gameVersion = useSearchParams().get("NYT") === "true" ? "NYT" : "AK";
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button onClick={() => {}} variant="ghost">
                <BarChartBig size={24} />
              </Button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>Leaderboard</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="md:min-w-[48em]">
        <SignedIn>
          <DialogHeader>
            <DialogTitle>Leaderboard</DialogTitle>
            <DialogDescription>
              See how you stack up against other players!
            </DialogDescription>
          </DialogHeader>
          <Suspense fallback={<LeaderboardTableSkeleton />}>
            <LeaderboardTable gameVersion={gameVersion} />
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
