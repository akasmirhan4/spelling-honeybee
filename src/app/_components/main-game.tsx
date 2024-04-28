"use client";

import { useEffect, useState } from "react";
import { GameInput } from "./game-input";
import { LettersGrid } from "./letters-grid";
import { api } from "~/trpc/react";
import { Progress } from "./progress";
import { WordList } from "./word-list";
import toast from "react-hot-toast";

// TODO:
// - shake animation when word is not valid
// - add notification
// - disable submitting words if textinput is empty or api is loading

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

  const [submittedValidWords, setSubmittedValidWords] = useState<string[]>([])

  // if textinput is longer than 19, alert window
  useEffect(() => {
    if (textInput.length >= 19) {
      alert("You have reached the maximum number of characters");
      setTextInput("");
    }
  }, [textInput]);

  useEffect(() => {
    if (game) {
      setOuterLetters(game.outerLetters);
      setAnswers(game.answers);
    }
  }, [game]);

  const onSubmitWord = async () => {
    const dictionary = await mutation.mutateAsync({ word: textInput });
    if (dictionary.isExist) {
      console.log(textInput + " exist in dictionary");
      setSubmittedValidWords([...submittedValidWords, textInput])
    } else {
      toast.error(textInput + " is not a valid word");
    }
    setTextInput("");
  };
  return game ? (
    <div className="container flex h-[100vh]">
      <div className="flex flex-1 flex-col items-center">
        <GameInput
          textInput={textInput}
          onTextInput={setTextInput}
          specialLetter={game.centerLetter}
          usableLetter={outerLetters}
          onSubmitWord={onSubmitWord}
        />
        <LettersGrid
          specialLetter={game.centerLetter}
          usableLetter={outerLetters}
          onLetterClick={(letter) => setTextInput(textInput + letter)}
        />
        <div className="flex gap-6">
          <CustomButton
            text="Delete"
            onClick={() => {
              setTextInput(textInput.slice(0, -1));
            }}
          />
          <CustomIconButton
            icon="imgs/shuffle.svg"
            onClick={() => {
              const shuffled = [...outerLetters].sort(
                () => Math.random() - 0.5,
              );
              setOuterLetters(shuffled);
            }}
          />
          <CustomButton text="Enter" onClick={onSubmitWord} />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <Progress />

        {/* word list */}
        <WordList words={[]} />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
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
      className={`border-grey flex h-full cursor-pointer select-none items-center rounded-full border px-12 text-2xl ${onMouseDown ? "bg-grey/50" : "bg-transparent"}`}
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
      <img src={icon} className="h-10 w-10" draggable={false} />
    </div>
  );
}
