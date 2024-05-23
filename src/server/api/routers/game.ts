import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import * as crypto from "crypto";
import { env } from "~/env";
import fs from "fs";
import type { GameData } from "~/types";
import path from "path";
import { load } from "cheerio";
import axios from "axios";
import { isText } from "domhandler";

const getRandomNumber = () => {
  const date = new Date();
  // get dd/mm/yyyy in en-SG
  const dateString = date.toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const secret = env.SECRET_STRING;
  const seedString = `${dateString}-${secret}`;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(seedString)
    .digest("hex");

  return parseInt(hash, 16);
};

type WordSearchResults = Record<string, Omit<GameData, "gameNumber">>;

type WSJOutput = {
  displayDate: string;
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  answers: string[];
};

type WSJOutputs = Record<"today" | "yesterday" | "pastPuzzles", WSJOutput>;

export const gameRouter = createTRPCRouter({
  getGameData: publicProcedure.input(z.object({})).mutation(async ({}) => {
    return await new Promise<GameData>((resolve, reject) => {
      const randInt = getRandomNumber();
      const filename = "output_selected_games.json";
      const filepath = path.join(process.cwd(), "python", "output", filename);
      // read file
      const data = fs.readFileSync(filepath, "utf8");
      const JSONdata = JSON.parse(data) as WordSearchResults;
      const games = Object.values(JSONdata);

      const gameIndex = randInt % games.length;
      const _selectedGame = games[gameIndex];
      if (!_selectedGame) {
        reject("No game found");
      } else {
        const gameNumber = Math.floor(
          (new Date().getTime() - new Date("2024-04-24").getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const selectedGame = {
          ..._selectedGame,
          gameNumber,
        };

        // convert all to cap
        selectedGame.centerLetter = selectedGame.centerLetter.toUpperCase();
        selectedGame.outerLetters = selectedGame.outerLetters.map((letter) =>
          letter.toUpperCase(),
        );
        selectedGame.validLetters = selectedGame.validLetters.map((letter) =>
          letter.toUpperCase(),
        );
        console.log({ selectedGame });
        resolve(selectedGame);
      }
    });
  }),
  getWSJGameData: publicProcedure.input(z.object({})).mutation(async ({}) => {
    const url = "https://www.nytimes.com/puzzles/spelling-bee";

    const response = await axios.get<string, Text>(url);
    const $ = load(response.data);
    const scriptDOM = $("script").get(2)?.firstChild;
    if (!scriptDOM) throw new Error("No script found");
    if (!isText(scriptDOM)) throw new Error("Script is not text");

    const scriptString = scriptDOM.data;

    if (!scriptString) {
      throw new Error("No script found");
    }

    const _gameData = scriptString
      .split("window.gameData = ")[1]
      ?.split(";")[0];

    if (!_gameData) {
      throw new Error("No game data found");
    }

    const allGameData = JSON.parse(_gameData) as WSJOutputs;

    // game number is days since 2024-04-24
    const gameNumber = Math.floor(
      (new Date().getTime() - new Date("2024-04-24").getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const gameData: GameData = {
      centerLetter: allGameData.today.centerLetter,
      outerLetters: allGameData.today.outerLetters,
      validLetters: allGameData.today.validLetters,
      answers: allGameData.today.answers,
      count: allGameData.today.answers.length,
      gameNumber,
    };

    gameData.centerLetter = gameData.centerLetter.toUpperCase();
    gameData.outerLetters = gameData.outerLetters.map((letter) =>
      letter.toUpperCase(),
    );
    gameData.validLetters = gameData.validLetters.map((letter) =>
      letter.toUpperCase(),
    );

    return gameData;
  }),
});
