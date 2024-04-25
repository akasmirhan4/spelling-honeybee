"use client";

import { useEffect, useState } from "react";

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
  const [fontSize, setFontSize] = useState("text-5xl")

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

  useEffect(() => {
    console.log(textInput.length)
    // change font size to smaller if textinput is longer than 10

    if (textInput.length >= 15) {
      setFontSize("text-3xl")
    }
    else if (textInput.length >= 10) {
        setFontSize("text-4xl")
      }
    else {
      setFontSize("text-5xl")
    }
  }, [textInput])
  

  // check if page is focused
  window.onfocus = () => setIsPageFocused(true);
  window.onblur = () => setIsPageFocused(false);
  window.onkeydown = (e) => handleKeyPress(e);

  return (
    <div
      className={`my-8 flex items-center justify-center text-center font-bold uppercase outline-none ${fontSize}`}
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
