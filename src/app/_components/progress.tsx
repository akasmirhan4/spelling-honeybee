"use client";

import { useEffect, useState } from "react";

type ProgressProps = {
  answers: string[];
  words: string[];
};

// # genius 70%
// # amazing 50%
// # great 40%
// # nice 25%
// # solid 15%
// # good 8%
// # moving up 5%
// # good start 2%

type ScoreRankName =
  | "Genius"
  | "Amazing"
  | "Great"
  | "Nice"
  | "Solid"
  | "Good"
  | "Moving Up"
  | "Good Start"
  | "Beginner";

type ScoreRank = {
  rank: ScoreRankName;
  score: number;
};

export function Progress({ answers, words }: ProgressProps): JSX.Element {
  const [score, setScore] = useState(0);
  const [_, setTotalScore] = useState(0);
  const [minScoreRank, setMinScoreRank] = useState<ScoreRank[]>([]);
  const [rank, setRank] = useState<ScoreRankName>("Beginner");
  const [progressLeftPosition, setProgressLeftPosition] = useState(0);

  useEffect(() => {
    const _totalScore = calculateTotalScore();
    setTotalScore(_totalScore);
    const _minScoreRank: ScoreRank[] = [
      { rank: "Beginner", score: 0 },
      { rank: "Good Start", score: Math.round(_totalScore * 0.02) },
      { rank: "Moving Up", score: Math.round(_totalScore * 0.05) },
      { rank: "Good", score: Math.round(_totalScore * 0.08) },
      { rank: "Solid", score: Math.round(_totalScore * 0.15) },
      { rank: "Nice", score: Math.round(_totalScore * 0.25) },
      { rank: "Great", score: Math.round(_totalScore * 0.4) },
      { rank: "Amazing", score: Math.round(_totalScore * 0.5) },
      { rank: "Genius", score: Math.round(_totalScore * 0.7) },
    ];
    setMinScoreRank(_minScoreRank);
  }, []);

  useEffect(() => {
    const _score = calculateScore();
    setScore(_score);
    const _rank = minScoreRank.findLast((rank) => _score >= rank.score);
    if (_rank) {
      setRank(_rank.rank);
      const _leftPosition =
        (getRankNumber(_score) / (minScoreRank.length - 1)) * 100;
      setProgressLeftPosition(_leftPosition);
    }
  }, [words]);

  const calculateTotalScore = () => {
    const totalScore = answers.reduce(reduceCalculateScore, 0);
    return totalScore;
  };

  const calculateScore = () => {
    const score = words.reduce(reduceCalculateScore, 0);
    return score;
  };

  const reduceCalculateScore = (acc: number, word: string) => {
    if (word.length <= 4) {
      acc += 1;
    } else {
      acc += word.length;
      // if word has 7 unique letters, add 7 points
      const uniqueLetters = new Set(word.split(""));
      if (uniqueLetters.size == 7) {
        acc += 7;
      }
    }
    return acc;
  };

  const getRankNumber = (score: number) => {
    return minScoreRank.findLastIndex((rank) => score >= rank.score);
  };

  return (
    <div className="mx-6 flex cursor-pointer items-center py-4 md:py-10">
      {/* rank */}
      <h3 className="text-md min-w-[6em] font-bold">{rank}</h3>
      {/* progress bar */}
      <div className="relative flex min-w-[calc(100%-8em)] flex-grow items-center">
        {/* progress line */}
        <div className="bg-grey relative flex h-[1px] w-full items-center">
          {/* progress dots*/}
          <div className="flex w-full justify-between">
            {minScoreRank.map((rank, index) => (
              <span
                key={index}
                className={`${getRankNumber(score) > index ? "after:bg-primary" : "after:bg-grey"} relative w-0 after:absolute after:left-[-4.5px] after:top-[-4.5px] after:h-[9px] after:w-[9px] after:rounded-full after:first:rounded-none after:last:rounded-none`}
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
          <span className="absolute flex h-full w-full items-center justify-center rounded-[50%] bg-primary text-xs">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}
