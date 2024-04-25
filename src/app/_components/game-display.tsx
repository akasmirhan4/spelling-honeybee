"use client";

import { use, useEffect, useState } from "react";
import { GameInput } from "./game-input";
import { LettersGrid } from "./letters-grid";

export function GameDisplay() {
  const [textInput, setTextInput] = useState("honeybees");
  // if textinput is longer than 19, alert window
  useEffect(() => {
    if (textInput.length >= 19) {
      alert("You have reached the maximum number of characters");
      setTextInput("")
    }
  }, [textInput])
  
  return (
    <>
      <GameInput textInput={textInput} onTextInput={setTextInput}/>
      <LettersGrid
        onLetterClick={(letter) => setTextInput(textInput + letter)}
      />
    </>
  );
}
