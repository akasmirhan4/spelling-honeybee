"use client";

import { LucideShare2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { GameContext } from "./GameProvider";
import { DateToStringFormatter } from "~/lib/formatter";

export default function ShareButton() {
  const isNYT = useSearchParams().get("NYT") === "true";
  const title = isNYT ? "Spell NYT" : "Spell AK";
  const game = useContext(GameContext);
  const gameData = isNYT ? game.NYTGameData : game.AKGameData;

  const isPangramFound = game.submittedWords.some(
    (word) => new Set(word).size === 7,
  );

  return !gameData ? (
    <Skeleton className="mx-1 h-10 w-14 rounded" />
  ) : (
    <Button
      variant="ghost"
      onClick={async () => {
        const shareData: ShareData = {
          title: `${title} (${DateToStringFormatter(gameData?.displayDate)})`,
          text: `*${title}*\n*${DateToStringFormatter(gameData?.displayDate)}*\n🏅 ${game.rank} (${game.score})\n📃 ${game.submittedWords.length} words\n🎉 ${isPangramFound ? "✅" : "❌"}`,
        };
        if (navigator.share && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast.success("Shared!");
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(
            `${shareData.title}\n${shareData.text}`,
          );
          toast.success("Results copied to clipboard");
        } else {
          toast.error("Sharing not supported 🪲");
        }
      }}
    >
      <LucideShare2 size={24} />
    </Button>
  );
}
