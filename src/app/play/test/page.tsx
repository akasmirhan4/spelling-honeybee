import * as crypto from "crypto";
import { env } from "~/env";
import { promises as fs } from "fs";
import type { GameData } from "~/types";
import path from "path";
import { DateToStringFormatter } from "~/lib/formatter";

const getRandomNumber = () => {
  const date = new Date();
  // get dd/mm/yyyy in en-SG
  const dateString = DateToStringFormatter(date);
  const secret = env.SECRET_STRING;
  const seedString = `${dateString}-${secret}`;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(seedString)
    .digest("hex");

  return {
    randInt: parseInt(hash, 16),
    date,
  };
};

type WordSearchResults = Record<
  string,
  Omit<GameData, "gameNumber" | "displayDate">
>;

async function getGameDataAK() {
  const { randInt, date } = getRandomNumber();
  const filename = "valid_games.json";
  // const filepath = path.join(process.cwd(), filename);
  const filepath = path.resolve(process.cwd(), "src", "app", "json", filename);
  console.log({ filepath });
  // read file
  const data = await fs.readFile(filepath, "utf8");
  const JSONdata = JSON.parse(data) as WordSearchResults;
  const games = Object.values(JSONdata);

  const gameIndex = randInt % games.length;
  const _selectedGame = games[gameIndex];
  if (!_selectedGame) {
    throw new Error("No game found");
  } else {
    const gameNumber = Math.floor(
      (new Date().getTime() - new Date("2024-04-24").getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const selectedGame: GameData = {
      ..._selectedGame,
      gameNumber,
      displayDate: date,
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
    return selectedGame;
  }
}

export default async function PlayTestPage() {
  const data = await getGameDataAK();
  console.log({ data });
  return <h1>Test Page!</h1>;
}
