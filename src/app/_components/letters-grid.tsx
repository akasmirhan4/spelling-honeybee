"use client";

import { on } from "events";
import { useState } from "react";

type GridProps = {
  letter: string;
  nthChild: number;
  handleClick?: (letter: string) => void;
};

function Grid({ letter, nthChild, handleClick }: GridProps): JSX.Element {
  const transformChilds = [
    "translate(0,0)",
    "translate(-75%, -50%)",
    "translate(0%, -100%)",
    "translate(75%, -50%)",
    "translate(75%, 50%)",
    "translate(0%, 100%)",
    "translate(-75%, 50%)",
  ];

  const [onMouseDown, setOnMouseDown] = useState(false);

  return (
    <div
      onMouseDown={(e) => {
        setOnMouseDown(true);
        handleClick && handleClick(letter);
      }}
      onMouseUp={() => {
        setOnMouseDown(false);
      }}
      onMouseLeave={() => {
        setOnMouseDown(false);
      }}
    >
      <svg
        className={`absolute left-[30%] top-[33%] h-[33%] w-[40%] cursor-pointer ${nthChild === 0 ? "fill-primary" : "fill-grey"} transition-all ease-in hover:opacity-80`}
        viewBox="0 0 120 103.92304845413263"
        data-testid="hive-cell"
        style={{
          transform: transformChilds[nthChild],
          overflow: "visible",
          overflowClipMargin: "content-box",
        }}
      >
        <polygon
          points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
          stroke="white"
          strokeWidth="7.5"
          data-testid="cell-fill"
          style={{
            transform: onMouseDown
              ? "scale3d(0.86, 0.86, 1)"
              : "scale3d(1, 1, 1)",
            transition: "all ease-out 0.1s",
            transformOrigin: "center center",
          }}
        />
        <text
          x="50%"
          y="50%"
          dy="0.35em"
          style={{
            textAnchor: "middle",
            fill: "black",
            fontSize: "2.5rem",
            fontWeight: "bold",
          }}
        >
          {letter}
        </text>
      </svg>
    </div>
  );
}

type LettersGridProps = {
  onLetterClick?: (letter: string) => void;
  specialLetter: string;
  usableLetter: string[];
};

export function LettersGrid({ onLetterClick, specialLetter, usableLetter }: LettersGridProps) {

  return (
    <div className="flex mb-12 w-80 flex-col align-middle">
      <div className="relative w-full pb-[100%] text-black">
        {
          // create svg for special letter
          <Grid
            key={0}
            letter={specialLetter}
            nthChild={0}
            handleClick={onLetterClick}
          />
        }
        {
          // create svg for each letter in usable letter and special letter.
          usableLetter.map((letter, i) => (
            <Grid
              key={i + 1}
              letter={letter}
              nthChild={i + 1}
              handleClick={onLetterClick}
            />
          ))
        }
      </div>
    </div>
  );
}
