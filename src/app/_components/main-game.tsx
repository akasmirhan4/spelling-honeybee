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
  const [textInput, setTextInput] = useState("");
  const { data: game } = api.game.getGameData.useQuery({});
  const [outerLetters, setOuterLetters] = useState<string[]>([]);

  const [submittedWords, setSubmittedWords] = useState<string[]>([]);

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
    }
  }, [game]);

  const onSubmitWord = async () => {
    if (!game) return;

    if (!textInput) return;

    const errors = [];

    const _textInput = textInput.toUpperCase();

    if (_textInput.length < 4) {
      const error = "Word must be at least 4 characters long";
      errors.push(error);
      toast.error(error);
    }

    if (!_textInput.includes(game.centerLetter)) {
      const error = "Word must contain the center letter";
      errors.push(error);
      toast.error(error);
    }

    if (submittedWords.includes(_textInput)) {
      const error = `You have already submitted "${_textInput}"!`;
      errors.push(error);
      toast.error(error);
    }

    // check if word contain other letters
    if (
      !_textInput
        .split("")
        .every((letter) => game.validLetters.includes(letter))
    ) {
      const error = `${_textInput} contains invalid letters!`;
      errors.push(error);
      toast.error(error);
    }

    // check if word is valid
    if (errors.length == 0) {
      const answers = game.answers;
      if (!answers.includes(_textInput.toLowerCase())) {
        const error = `"${_textInput}" is not a valid word!`;
        errors.push(error);
        toast.error(error);
      } else {
        setSubmittedWords([...submittedWords, _textInput]);
        toast.success(`"${_textInput}" is a valid word!`);
      }
    }
    setTextInput("");
  };
  return game ? (
    <div className="container grid h-[100dvh] gap-y-8 md:h-[100dvh] md:grid-cols-2">
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
        <Progress words={submittedWords} answers={game.answers} />

        {/* word list */}
        <WordList words={submittedWords} />
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
      className={`border-grey flex h-full cursor-pointer select-none items-center rounded-full border px-8 text-xl md:px-12 md:text-2xl ${onMouseDown ? "bg-grey/50" : "bg-transparent"}`}
      onMouseDown={() => {
        setOnMouseDown(true);
        onClick && onClick();
      }}
      onMouseUp={() => setOnMouseDown(false)}
      onMouseLeave={() => setOnMouseDown(false)}
      onTouchStart={() => setOnMouseDown(true)}
      onTouchEnd={() => setOnMouseDown(false)}
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
      onTouchStart={() => setOnMouseDown(true)}
      onTouchEnd={() => setOnMouseDown(false)}
    >
      {/* icon equal side*/}
      <img src={icon} className="h-10 w-10" draggable={false} />
    </div>
  );
}
