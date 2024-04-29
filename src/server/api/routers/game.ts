import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import * as crypto from "crypto";
import { env } from "~/env";
import fs from "fs";
import type { GameData } from "~/types";

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

export const gameRouter = createTRPCRouter({
  getGameData: publicProcedure.input(z.object({})).mutation(async ({}) => {
    return await new Promise<GameData>((resolve, reject) => {
      const randInt = getRandomNumber();
      const filename = "output_selected_games.json";
      const filepath = `./python/output/${filename}`;
      // read file
      const data = fs.readFileSync(filepath, "utf8");
      const games: GameData[] = Object.values(JSON.parse(data));

      const gameIndex = randInt % games.length;
      const selectedGame = games[gameIndex];
      if (!selectedGame) {
        reject("No game found");
      } else {
        // convert all to cap
        selectedGame.centerLetter = selectedGame.centerLetter.toUpperCase();
        selectedGame.outerLetters = selectedGame.outerLetters.map((letter) =>
          letter.toUpperCase(),
        );
        selectedGame.validLetters = selectedGame.validLetters.map((letter) =>
          letter.toUpperCase(),
        );
        resolve(selectedGame);
      }
    });
  }),
  getWSJGameData: publicProcedure.input(z.object({})).mutation(async ({}) => {
    // run python script await
    return await new Promise<GameData>((resolve, reject) => {
      const filename = "wsj_scrape.py";
      const filepath = `./python/${filename}`;
      const { exec } = require("child_process");
      exec(`python ${filepath}`, (err: string, stdout: string, stderr: string) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        const output = JSON.parse(stdout);
        const gameData: GameData = {
          centerLetter: output.centerLetter,
          outerLetters: output.outerLetters,
          validLetters: output.validLetters,
          answers: output.answers,
          count: output.answers.length,
        };

        gameData.centerLetter = gameData.centerLetter.toUpperCase();
        gameData.outerLetters = gameData.outerLetters.map((letter) =>
          letter.toUpperCase(),
        );
        gameData.validLetters = gameData.validLetters.map((letter) =>
          letter.toUpperCase(),
        );

        console.log({ gameData });
        resolve(gameData);
      });
    });
  }),
});
