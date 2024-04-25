"use client";

import { useState } from "react";

type GameInputProps = {
  textInput: string;
  onTextInput: (text: string) => void;
};
// special input
export function GameInput({ textInput, onTextInput }: GameInputProps) {
  const [isPageFocused, setIsPageFocused] = useState(true);
  //   special letter
  const specialLetter = "Y";
  const usableLetter = ["H", "B", "N", "E", "O", "S"];

  //   handle keypress
  const handleKeyPress = (e: KeyboardEvent) => {
    // if backspace, remove last letter
    if (e.key === "Backspace") {
      onTextInput(textInput.slice(0, -1));
    }    
    // else if alphabet not others
    else if (usableLetter.includes(e.key.toUpperCase())) {
      onTextInput(textInput + e.key);
    }
  };

  // check if page is focused
  window.onfocus = () => setIsPageFocused(true);
  window.onblur = () => setIsPageFocused(false);
  window.onkeydown = (e) => handleKeyPress(e);

  return (
    <div
      className="my-8 flex items-center justify-center text-center text-5xl font-bold uppercase outline-none"
      tabIndex={0}
    >
      {/* create span for each letter in textinput. if letter is special letter make the color primary, if not in usable letter make grey */}
      {textInput.split("").map((letter, i) => (
        <span
          key={i}
          className={`${
            letter.toUpperCase() === specialLetter
              ? "text-primary"
              : usableLetter.includes(letter.toUpperCase())
                ? "text-black"
                : "text-grey"
          }`}
        >
          {letter}
        </span>
      ))}
      {/* blink */}
      <span
        className={`animate-blink ml-[1px] h-full min-h-[3rem] w-[0.25rem] ${isPageFocused ? "bg-primary" : "bg-transparent"}`}
      />
    </div>
  );
}
