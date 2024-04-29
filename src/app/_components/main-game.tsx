"use client";

import { useEffect, useState } from "react";
import { GameInput } from "./game-input";
import { LettersGrid } from "./letters-grid";
import { api } from "~/trpc/react";
import { Progress } from "./progress";
import { WordList } from "./word-list";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { GameData } from "~/types";

// TODO:
// - shake animation when word is not valid
// - add notification
// - disable submitting words if textinput is empty or api is loading

export function MainGame() {
  const [textInput, setTextInput] = useState(
    localStorage.getItem("textInput") || "",
  );
  const amirrul = api.game.getGameData.useMutation();
  const wsj = api.game.getWSJGameData.useMutation();
  const [validLetters, setValidLetters] = useState<string[]>([]);
  const [centerLetter, setCenterLetter] = useState("");
  const [outerLetters, setOuterLetters] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);

  const playWSJ = useSearchParams().get("wsj") === "true";

  useEffect(() => {
    setSubmittedWords([]);
    if (playWSJ) {
      wsj.mutateAsync(
        {},
        {
          onSuccess: (data: GameData) => {
            setOuterLetters(data.outerLetters);
            setCenterLetter(data.centerLetter);
            setValidLetters(data.validLetters);
            setAnswers(data.answers);
          },
        },
      );
      const wsjSubmittedWords = localStorage.getItem("wsjSubmittedWords");
      if (wsjSubmittedWords) {
        setSubmittedWords(wsjSubmittedWords.split(","));
      }
    } else {
      amirrul.mutateAsync(
        {},
        {
          onSuccess: (data: GameData) => {
            setOuterLetters(data.outerLetters);
            setCenterLetter(data.centerLetter);
            setValidLetters(data.validLetters);
            setAnswers(data.answers);
          },
        },
      );
      const amirrulSubmittedWords = localStorage.getItem(
        "amirrulSubmittedWords",
      );
      if (amirrulSubmittedWords) {
        setSubmittedWords(amirrulSubmittedWords.split(","));
      }
    }
  }, [playWSJ]);

  // if textinput is longer than 19, alert window
  useEffect(() => {
    if (textInput.length >= 19) {
      toast.error("You have reached the maximum number of characters");
      setTextInput("");
    }
  }, [textInput]);

  const onSubmitWord = async () => {
    if (!textInput) return;

    const errors = [];

    const _textInput = textInput.toUpperCase();

    if (_textInput.length < 4) {
      const error = "Word must be at least 4 characters long";
      errors.push(error);
      toast.error(error);
    }

    if (!_textInput.includes(centerLetter)) {
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
      !_textInput.split("").every((letter) => validLetters.includes(letter))
    ) {
      const error = `${_textInput} contains invalid letters!`;
      errors.push(error);
      toast.error(error);
    }

    // check if word is valid
    if (errors.length == 0) {
      if (!answers.includes(_textInput.toLowerCase())) {
        const error = `"${_textInput}" is not a valid word!`;
        errors.push(error);
        toast.error(error);
      } else {
        const _submittedWords = [...submittedWords, _textInput];
        setSubmittedWords(_submittedWords);
        if (playWSJ) {
          localStorage.setItem("wsjSubmittedWords", _submittedWords.join(","));
        } else {
          localStorage.setItem(
            "amirrulSubmittedWords",
            _submittedWords.join(","),
          );
        }
        toast.success(`"${_textInput}" is a valid word!`);
      }
    }
    setTextInput("");
  };

  return (!playWSJ && !amirrul.isPending) || (playWSJ && !wsj.isPending) ? (
    <div className="flex flex-col justify-center md:container md:flex-row-reverse">
      <div className="flex w-screen flex-col md:w-1/2 md:flex-1">
        <Progress words={submittedWords} answers={answers} />
        {/* word list */}
        <WordList words={submittedWords} />
      </div>
      <div className="flex w-screen flex-1 flex-col items-center md:w-1/2">
        <GameInput
          textInput={textInput}
          onTextInput={setTextInput}
          specialLetter={centerLetter}
          usableLetter={outerLetters}
          onSubmitWord={onSubmitWord}
        />
        <LettersGrid
          specialLetter={centerLetter}
          usableLetter={outerLetters}
          onLetterClick={(letter) => setTextInput(textInput + letter)}
        />
        <div className="mb-8 flex gap-6">
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
      className={`border-grey text-md flex cursor-pointer select-none items-center rounded-full border px-8 md:px-12 ${onMouseDown ? "bg-grey/50" : "bg-transparent"}`}
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
