"use client";

import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import type { GameData } from "~/types";

import { RefreshCcw } from "lucide-react";
import { Progress } from "../_components/progress";
import { WordList } from "../_components/word-list";
import { GameInput } from "../_components/game-input";
import { LettersGrid } from "../_components/letters-grid";
import Confetti from "../_components/Confetti";
import { Button } from "~/components/ui/button";
import { GameContext } from "../_components/GameProvider";
import { getGameDataAK, getGameDataNYT } from "../_components/game";
import { DateToStringFormatter } from "~/lib/formatter";

// TODO:
// - shake animation when word is not valid
// - cache games data and reset when date changes

export default function PlayPage() {
  const [textInput, setTextInput] = useState("");
  const [validLetters, setValidLetters] = useState<string[]>([]);
  const [centerLetter, setCenterLetter] = useState("");
  const [outerLetters, setOuterLetters] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [isConfettiVisible, setIsConfettiVisible] = useState(false);
  const game = useContext(GameContext);

  const playNYT = useSearchParams().get("NYT") === "true";

  useEffect(() => {
    setSubmittedWords([]);
    game.setSubmittedWords([]);
    const date = DateToStringFormatter(new Date());
    const displayDate = localStorage.getItem("displayDate");
    if (!displayDate) {
      localStorage.setItem("displayDate", date);
    } else {
      if (displayDate !== date) {
        localStorage.setItem("displayDate", date);
        localStorage.setItem("NYTSubmittedWords" + date, "");
        localStorage.setItem("AKSubmittedWords" + date, "");
      }
    }
    if (playNYT) {
      if (!game.NYTGameData) {
        getGameDataNYT()
          .then((data: GameData) => {
            setOuterLetters(data.outerLetters);
            setCenterLetter(data.centerLetter);
            setValidLetters(data.validLetters);
            setAnswers(data.answers);
            game.setNYTGameData(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setOuterLetters(game.NYTGameData.outerLetters);
        setCenterLetter(game.NYTGameData.centerLetter);
        setValidLetters(game.NYTGameData.validLetters);
        setAnswers(game.NYTGameData.answers);
      }
      const NYTSubmittedWords = localStorage.getItem(
        "NYTSubmittedWords" + date,
      );
      if (NYTSubmittedWords) {
        setSubmittedWords(NYTSubmittedWords.split(","));
        game.setSubmittedWords(NYTSubmittedWords.split(","));
      }
    } else {
      if (!game.AKGameData) {
        getGameDataAK()
          .then((data: GameData) => {
            setOuterLetters(data.outerLetters);
            setCenterLetter(data.centerLetter);
            setValidLetters(data.validLetters);
            setAnswers(data.answers);
            game.setAKGameData(data);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        setOuterLetters(game.AKGameData.outerLetters);
        setCenterLetter(game.AKGameData.centerLetter);
        setValidLetters(game.AKGameData.validLetters);
        setAnswers(game.AKGameData.answers);
      }
      const AKSubmittedWords = localStorage.getItem("AKSubmittedWords" + date);
      if (AKSubmittedWords) {
        setSubmittedWords(AKSubmittedWords.split(","));
        game.setSubmittedWords(AKSubmittedWords.split(","));
      }
    }
  }, [playNYT]);

  // if textinput is longer than 19, alert window
  useEffect(() => {
    if (textInput.length >= 19) {
      toast.error("You have reached the maximum number of characters");
      setTextInput("");
    }
  }, [textInput]);

  const onSubmitWord = async () => {
    if (!textInput) return;
    const date = DateToStringFormatter(new Date());

    const errors = [];

    const _textInput = textInput.toUpperCase();

    if (_textInput.length < 4) {
      const error = "Word must be at least 4 characters long";
      errors.push(error);
      toast.error(error);
    } else if (!_textInput.includes(centerLetter)) {
      const error = "Word must contain the center letter";
      errors.push(error);
      toast.error(error);
    } else if (submittedWords.includes(_textInput)) {
      const error = `You have already submitted "${_textInput}"!`;
      errors.push(error);
      toast.error(error);
    }

    // check if word contain other letters
    else if (
      !_textInput.split("").every((letter) => validLetters.includes(letter))
    ) {
      const error = `${_textInput} contains invalid letters!`;
      errors.push(error);
      toast.error(error);
    }

    // check if word is valid
    else if (errors.length == 0) {
      if (!answers.includes(_textInput.toLowerCase())) {
        const error = `"${_textInput}" is not a valid word!`;
        errors.push(error);
        toast.error(error);
      } else {
        const _submittedWords = [...submittedWords, _textInput];
        setSubmittedWords(_submittedWords);
        game.setSubmittedWords(_submittedWords);
        if (playNYT) {
          localStorage.setItem(
            "NYTSubmittedWords" + date,
            _submittedWords.join(","),
          );
        } else {
          localStorage.setItem(
            "AKSubmittedWords" + date,
            _submittedWords.join(","),
          );
        }
        // All else, word is valid

        // check if word is pangram
        if (new Set(_textInput).size == 7) {
          toast.success("Pangram!");
          setIsConfettiVisible(true);
        } else {
          toast.success(`"${_textInput}" is a valid word!`);
        }
      }
    }
    setTextInput("");
  };

  useEffect(() => {
    console.log({
      game,
      isValid: (!playNYT && game.AKGameData) || (playNYT && game.NYTGameData),
    });
  }, [game.AKGameData, game.NYTGameData]);

  return (!playNYT && game.AKGameData) || (playNYT && game.NYTGameData) ? (
    <div className="flex w-full flex-col justify-center md:flex-row-reverse">
      <div className="flex w-full flex-col md:w-3/5">
        <Progress words={submittedWords} answers={answers} />
        {/* word list */}
        <WordList words={submittedWords} />
      </div>
      <div className="flex w-full flex-col items-center md:w-2/5">
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
            iconNode={<RefreshCcw className="size-6" />}
            onClick={() => {
              const shuffled = [...outerLetters].sort(
                () => Math.random() - 0.5,
              );
              setOuterLetters(shuffled);
            }}
          />
          <CustomButton text="Enter" onClick={onSubmitWord} />
        </div>
        <Confetti
          active={isConfettiVisible}
          onComplete={() => setIsConfettiVisible(false)}
        />
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
  return (
    <Button
      className="text-md rounded-full"
      size="lg"
      variant="outline"
      onMouseDown={() => {
        onClick && onClick();
      }}
    >
      {text}
    </Button>
  );
}

type CustomIconButtonProps = {
  iconNode: React.ReactNode;
  onClick?: () => void;
};
function CustomIconButton({ iconNode, onClick }: CustomIconButtonProps) {
  return (
    <Button
      variant="outline"
      size="lg"
      className="rounded-full p-2"
      onMouseDown={() => {
        onClick && onClick();
      }}
    >
      {iconNode}
    </Button>
  );
}

function Loading() {
  return (
    <div className="my-8 flex flex-col items-center justify-center">
      <svg
        aria-hidden="true"
        className="dark:yellow/50 size-12 animate-spin fill-yellow text-gray-200"
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
          <div className="mt-4 animate-type overflow-hidden whitespace-nowrap text-lg font-bold text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    </div>
  );
}
