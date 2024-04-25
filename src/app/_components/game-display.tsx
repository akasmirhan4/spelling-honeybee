"use client";

import { useState } from "react";
import { GameInput } from "./game-input";
import { LettersGrid } from "./letters-grid";

export function GameDisplay() {
  const [textInput, setTextInput] = useState("honeybees");
  return (
    <>
      <GameInput textInput={textInput} onTextInput={setTextInput}/>
      <LettersGrid
        onLetterClick={(letter) => setTextInput(textInput + letter)}
      />
    </>
  );
}
