"use client";

import { useState } from "react";

type WordListProps = {
  words: string[];
};

export function WordList({ words }: WordListProps): JSX.Element {
  return <WordListCompact words={words} />;
}

const WordListCompact = ({ words }: WordListProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="border-gray cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div
        className={`mx-4 flex rounded-md border ${isExpanded ? "flex-col" : "flex-row-reverse"}`}
      >
        <div className="flex items-center justify-between">
          <h3
            className={`${!isExpanded && "hidden"} my-4 ml-4`}
          >{`You have found ${words.length} word${words.length > 1 ? "s" : ""}`}</h3>
          <div
            className="bg-white px-4 py-4"
            style={{
              boxShadow: "0px 0px 20px 5px white",
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            <img
              src="imgs/back.svg"
              className={`flex h-3 w-3 ${isExpanded ? "rotate-[90deg]" : "rotate-[270deg]"} items-center justify-center transition-all ease-in-out`}
              draggable={false}
            />
          </div>
        </div>
        <div className="flex max-h-[20dvh] flex-1 flex-col justify-center overflow-y-auto overflow-x-hidden px-4 py-3 md:max-h-[70dvh]">
          <div className={`flex ${isExpanded && "flex-col"}`}>
            {words.toReversed().map((word, index) => {
              // if word has 7 unique letters, bold the word
              const uniqueLetters = new Set(word.split(""));
              const isPangram = uniqueLetters.size == 7;
              return (
                <div key={index} className="mr-2 flex items-center">
                  <span
                    className={`${isExpanded && "border-gray mb-1 w-1/2 border-b px-2 py-0.5"} ${isPangram && "font-bold"}`}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
