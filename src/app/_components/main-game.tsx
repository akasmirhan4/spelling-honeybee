"use client";

import { useEffect, useState } from "react";
import { GameInput } from "./game-input";
import { LettersGrid } from "./letters-grid";
import { api } from "~/trpc/react";
import { Progress } from "./progress";
import { WordList } from "./word-list";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import type { GameData } from "~/types";
import Image from "next/image";

// TODO:
// - shake animation when word is not valid
// - add notification
// - disable submitting words if textinput is empty or api is loading

export function MainGame() {
  const [textInput, setTextInput] = useState(
    localStorage.getItem("textInput") ?? "",
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
    const date = new Date().toLocaleDateString();
    const displayDate = localStorage.getItem("displayDate");
    if (!displayDate) {
      localStorage.setItem("displayDate", date);
    } else {
      if (displayDate !== date) {
        localStorage.setItem("displayDate", date);
        localStorage.setItem("wsjSubmittedWords" + date, "");
        localStorage.setItem("amirrulSubmittedWords" + date, "");
        localStorage.removeItem("textInput");
      }
    }
    if (playWSJ) {
      wsj.mutate(
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
      const wsjSubmittedWords = localStorage.getItem(
        "wsjSubmittedWords" + date,
      );
      if (wsjSubmittedWords) {
        setSubmittedWords(wsjSubmittedWords.split(","));
      }
    } else {
      amirrul.mutate(
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
        "amirrulSubmittedWords" + date,
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
    const date = new Date().toLocaleDateString();

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
          localStorage.setItem(
            "wsjSubmittedWords" + date,
            _submittedWords.join(","),
          );
        } else {
          localStorage.setItem(
            "amirrulSubmittedWords" + date,
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
    <Loading />
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
      className={`text-md flex cursor-pointer select-none items-center rounded-full border border-grey px-8 md:px-12 ${onMouseDown ? "bg-grey/50" : "bg-transparent"}`}
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
      <Image width={40} height={40} alt={icon} src={icon} draggable={false} />
    </div>
  );
}

function Loading() {
  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <svg
        aria-hidden="true"
        className="dark:primary/50 size-12 animate-spin fill-primary text-gray-200"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <div>
        {/* Make a loading text that load one letter at a time */}
        <div className="inline-block">
          <div className="animate-type mt-4 overflow-hidden whitespace-nowrap text-lg font-bold text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}
