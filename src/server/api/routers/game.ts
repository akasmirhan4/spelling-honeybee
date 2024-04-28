import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import * as crypto from "crypto";
import { env } from "~/env";
import fs from "fs";

type GameData = {
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  answers: string[];
  count: number;
}

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
  getGameData: publicProcedure.input(z.object({})).query(async ({}) => {
    const randInt = getRandomNumber();
    const filename = "output_selected_games.json";
    const filepath = `./python/output/${filename}`;
    // read file
    const data = fs.readFileSync(filepath, "utf8");
    const games = Object.values(JSON.parse(data)) as GameData[];

    const gameIndex = randInt % games.length;
    const selectedGame = games[gameIndex];
    if (!selectedGame) {
      throw new Error("No game found");
    }

    // convert all to cap
    selectedGame.centerLetter = selectedGame.centerLetter.toUpperCase();
    selectedGame.outerLetters = selectedGame.outerLetters.map((letter) => letter.toUpperCase());
    selectedGame.validLetters = selectedGame.validLetters.map((letter) => letter.toUpperCase());
    return selectedGame;
  }),
});
