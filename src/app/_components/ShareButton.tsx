"use client";

import { LucideShare2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { GameContext } from "./GameProvider";

export default function ShareButton() {
  const isWSJ = useSearchParams().get("wsj") === "true";
  const title = isWSJ ? "Spell WSJ" : "Spell AK";
  const game = useContext(GameContext);
  const gameData = isWSJ ? game.wsjGameData : game.amirruleGameData;

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
          title: `${title} #${gameData.gameNumber}`,
          text: `*${title}*\n*#${gameData.gameNumber}*\n🏅 ${game.rank} (${game.score})\n📃 ${game.submittedWords.length} words\n🎉 ${isPangramFound ? "✅" : "❌"}`,
        };
        console.log({ shareData });
        if (navigator.share && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast.success("Shared!");
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
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
