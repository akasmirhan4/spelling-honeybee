"use client";

import { useEffect, useState } from "react";

type GameInputProps = {
  textInput: string;
  onTextInput: (text: string) => void;
  specialLetter: string;
  usableLetter: string[];
  onSubmitWord?: () => void;
};
// special input
export function GameInput({
  textInput,
  onTextInput,
  specialLetter,
  usableLetter,
  onSubmitWord,
}: GameInputProps) {
  const [isPageFocused, setIsPageFocused] = useState(true);
  const [fontSize, setFontSize] = useState("text-5xl");

  //   handle keypress
  const handleKeyPress = (e: KeyboardEvent, textInput: string) => {
    // if backspace, remove last letter
    if (e.key === "Backspace") {
      textInput = textInput.slice(0, -1);
      onTextInput(textInput);
    }
    // else if alphabet not others
    else if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
      textInput += e.key.toUpperCase();
      onTextInput(textInput);
    }
    // if enter, submit word
    else if (e.key === "Enter") {
      onSubmitWord && onSubmitWord();
    }
  };

  useEffect(() => {
    window.onkeydown = (e) => handleKeyPress(e, textInput);
    // change font size to smaller if textinput is longer than 10
    if (textInput.length >= 15) {
      setFontSize("text-3xl");
    } else if (textInput.length >= 10) {
      setFontSize("text-4xl");
    } else {
      setFontSize("text-5xl");
    }
  }, [textInput]);

  useEffect(() => {
    // check if page is focused
    window.onfocus = () => setIsPageFocused(true);
    window.onblur = () => setIsPageFocused(false);
    return () => {
      window.onkeydown = null;
      window.onfocus = null;
      window.onblur = null;
    };
  }, []);

  return (
    <div
      className={`my-6 flex items-center justify-center text-center font-bold uppercase outline-none md:my-8 ${fontSize}`}
      tabIndex={0}
    >
      {/* create span for each letter in textinput. if letter is special letter make the color primary, if not in usable letter make gray */}
      {textInput.split("").map((letter, i) => (
        <span
          key={i}
          className={`${
            letter.toUpperCase() === specialLetter
              ? "text-primary"
              : usableLetter.includes(letter.toUpperCase())
                ? "text-black"
                : "text-gray-300"
          }`}
        >
          {letter}
        </span>
      ))}
      {/* blink */}
      <span
        className={`ml-[1px] h-full min-h-[3rem] w-[0.25rem] animate-blink ${isPageFocused ? "bg-primary" : "bg-transparent"}`}
      />
    </div>
  );
}
