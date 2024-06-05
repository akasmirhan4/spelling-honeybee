"use client";

import { useEffect, useState } from "react";
import { ScoreRank, ScoreRankName } from "./GameView";

type ProgressProps = {
  score: number;
  minScoreRank: ScoreRank[];
  rank: ScoreRankName;
};

export function Progress({
  score,
  minScoreRank,
  rank,
}: ProgressProps): JSX.Element {
  const [progressLeftPosition, setProgressLeftPosition] = useState(0);

  useEffect(() => {
    const _leftPosition =
      (getRankNumber(score) / (minScoreRank.length - 1)) * 100;

    setProgressLeftPosition(_leftPosition);
  }, [score, minScoreRank]);

  const getRankNumber = (score: number) => {
    return minScoreRank.findLastIndex((rank) => score >= rank.score);
  };

  return (
    <div className="mr-2 flex cursor-pointer items-center py-4 md:py-10">
      {/* rank */}
      <h3 className="text-md min-w-[6em] font-bold">{rank}</h3>
      {/* progress bar */}
      <div className="relative flex min-w-[calc(100%-8em)] flex-grow items-center">
        {/* progress line */}
        <div className="relative flex h-[1px] w-full items-center bg-gray-300">
          {/* progress dots*/}
          <div className="flex w-full justify-between">
            {minScoreRank.map((rank, index) => (
              <span
                key={index}
                className={`${getRankNumber(score) > index ? "after:bg-yellow" : "after:bg-gray-300"} relative w-0 after:absolute after:left-[-4.5px] after:top-[-4.5px] after:h-[9px] after:w-[9px] after:rounded-full after:first:rounded-none after:last:rounded-none`}
              />
            ))}
          </div>
        </div>
        {/* progress marker */}
        <div
          className={`absolute h-8 w-8 translate-x-[-50%] transition-all ease-in`}
          style={{
            left: `${progressLeftPosition}%`,
          }}
        >
          {/* progress value */}
          <span className="absolute flex h-full w-full items-center justify-center rounded-[50%] bg-yellow text-xs">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
