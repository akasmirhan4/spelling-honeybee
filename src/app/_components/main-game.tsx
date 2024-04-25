"use client";

import { useEffect, useState } from "react";
import { GameInput } from "./game-input";
import { LettersGrid } from "./letters-grid";
import { api } from "~/trpc/react";

export function MainGame() {
  const [textInput, setTextInput] = useState("HONEYBEES");
  const specialLetter = "Y";
  const [usableLetter, setUsableLetter] = useState([
    "H",
    "B",
    "N",
    "E",
    "O",
    "S",
  ]);
  const mutation = api.dictionary.isWordExist.useMutation();

  // if textinput is longer than 19, alert window
  useEffect(() => {
    if (textInput.length >= 19) {
      alert("You have reached the maximum number of characters");
      setTextInput("");
    }
  }, [textInput]);

  const onSubmitWord = async () => {
    const dictionary = await mutation.mutateAsync({ word: textInput });
    if (dictionary.isExist) {
      console.log(textInput + " exist in dictionary");
    }
    else{
      console.log(textInput + " does not exist in dictionary");
    }
    setTextInput("");
  };

  return (
    <>
      <GameInput
        textInput={textInput}
        onTextInput={setTextInput}
        specialLetter={specialLetter}
        usableLetter={usableLetter}
        onSubmitWord={onSubmitWord}
      />
      <LettersGrid
        specialLetter={specialLetter}
        usableLetter={usableLetter}
        onLetterClick={(letter) => setTextInput(textInput + letter)}
      />
      <div className="flex gap-3">
        <CustomButton
          text="Delete"
          onClick={() => {
            setTextInput("");
          }}
        />
        <CustomIconButton
          icon="imgs/shuffle.svg"
          onClick={() => {
            const shuffled = [...usableLetter].sort(() => Math.random() - 0.5);
            setUsableLetter(shuffled);
          }}
        />
        <CustomButton text="Enter" onClick={onSubmitWord} />
      </div>
    </>
  );
}

type CustomButtonProps = {
  text?: string;
  onClick?: () => void;
};
function CustomButton({ text, onClick }: CustomButtonProps) {
  const [onMouseDown, setOnMouseDown] = useState(false);

  return (
    <div
      className={`border-grey flex h-full cursor-pointer select-none items-center rounded-full border px-6 text-sm ${onMouseDown ? "bg-grey/50" : "bg-transparent"}`}
      onMouseDown={() => {
        setOnMouseDown(true);
        onClick && onClick();
      }}
      onMouseUp={() => setOnMouseDown(false)}
      onMouseLeave={() => setOnMouseDown(false)}
    >
      {text}
    </div>
  );
}

type CustomIconButtonProps = {
  icon: string;
  onClick?: () => void;
};
function CustomIconButton({ icon, onClick }: CustomIconButtonProps) {
  const [onMouseDown, setOnMouseDown] = useState(false);
  return (
    <div
      className={`border-gray flex cursor-pointer select-none items-center rounded-full border p-2 ${onMouseDown ? "bg-grey/50" : "bg-transparent"}`}
      onMouseDown={() => {
        setOnMouseDown(true);
        onClick && onClick();
      }}
      onMouseUp={() => setOnMouseDown(false)}
      onMouseLeave={() => setOnMouseDown(false)}
    >
      {/* icon equal side*/}
      <img src={icon} className="h-5 w-5" draggable={false} />
    </div>
  );
}
