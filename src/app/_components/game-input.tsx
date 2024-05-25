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

  const [fontSize, setFontSize] = useState("text-5xl");

  //   handle keypress
  const handleKeyPress = (e: KeyboardEvent, textInput: string) => {
    const target = e.target as HTMLElement;
    // if ariaModal is true, return
    if (target.ariaModal || target.getAttribute("aria-modal")) return;
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

  return (
    <div
      className={`my-6 flex items-center justify-center text-center font-bold uppercase outline-none md:my-8 ${fontSize}`}
      tabIndex={0}
    >
      {textInput.split("").map((letter, i) => (
        <span
          key={i}
          className={`${
            letter.toUpperCase() === specialLetter
              ? "text-yellow"
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
        className={`ml-[1px] h-full min-h-[3rem] w-[0.25rem] animate-blink bg-yellow`}
      />
    </div>
  );
}
