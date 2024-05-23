"use client";

import { createContext, useState } from "react";
import { GameData } from "~/types";

// create a game context
type GameContextType = {
  wsjGameData: GameData | null;
  setWsjGameData: (data: GameData) => void;
  amirruleGameData: GameData | null;
  setAmirruleGameData: (data: GameData) => void;
  submittedWords: string[];
  setSubmittedWords: (words: string[]) => void;
  rank: string;
  setRank: (rank: string) => void;
  score: number;
  setScore: (score: number) => void;
};

export const GameContext = createContext({
  wsjGameData: null,
  setWsjGameData: () => {},
  amirruleGameData: null,
  setAmirruleGameData: () => {},
  submittedWords: [],
  setSubmittedWords: () => {},
  isPangramFound: false,
  setIsPangramFound: () => {},
  rank: "",
  setRank: () => {},
  score: 0,
  setScore: () => {},
} as GameContextType);

export default function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wsjGameData, setWsjGameData] = useState<GameData | null>(null);
  const [amirruleGameData, setAmirruleGameData] = useState<GameData | null>(
    null,
  );
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState("");
  return (
    <GameContext.Provider
      value={{
        wsjGameData,
        setWsjGameData,
        amirruleGameData,
        setAmirruleGameData,
        submittedWords,
        setSubmittedWords,
        rank,
        setRank,
        score,
        setScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
