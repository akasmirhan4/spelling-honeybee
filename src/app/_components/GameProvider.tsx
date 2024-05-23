"use client";

import { createContext, useState } from "react";
import { GameData } from "~/types";

// create a game context
type GameContextType = {
  NYTGameData: GameData | null;
  setNYTGameData: (data: GameData) => void;
  AKGameData: GameData | null;
  setAKGameData: (data: GameData) => void;
  submittedWords: string[];
  setSubmittedWords: (words: string[]) => void;
  rank: string;
  setRank: (rank: string) => void;
  score: number;
  setScore: (score: number) => void;
};

export const GameContext = createContext<GameContextType>({
  NYTGameData: null,
  setNYTGameData: () => undefined,
  AKGameData: null,
  setAKGameData: () => undefined,
  submittedWords: [],
  setSubmittedWords: () => undefined,
  rank: "",
  setRank: () => undefined,
  score: 0,
  setScore: () => undefined,
});

export default function GameProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [NYTGameData, setNYTGameData] = useState<GameData | null>(null);
  const [AKGameData, setAKGameData] = useState<GameData | null>(null);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [rank, setRank] = useState("");
  return (
    <GameContext.Provider
      value={{
        NYTGameData,
        setNYTGameData,
        AKGameData,
        setAKGameData,
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
