import {
  serial,
  pgTableCreator,
  timestamp,
  varchar,
  index,
  integer,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `spelling_honeybee_${name}`,
);

export const ScoreRankName = [
  "Genius",
  "Amazing",
  "Great",
  "Nice",
  "Solid",
  "Good",
  "Moving Up",
  "Good Start",
  "Beginner",
] as const;

export type ScoreRankNameType = (typeof ScoreRankName)[number];

export const GameVersion = ["NYT", "AK"] as const;

export type GameVersion = (typeof GameVersion)[number];

export const rankEnum = pgEnum("rank", ScoreRankName);
export const gameVersionEnum = pgEnum("game_version", GameVersion);

export const userScore = createTable(
  "user_score",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", {
      length: 20,
    }).notNull(),
    score: integer("score").notNull(),
    rank: rankEnum("rank").notNull(),
    gameVersion: gameVersionEnum("game_version").notNull(),
    nSubmittedWords: integer("n_submitted_words").notNull(),
    pangramFound: boolean("pangram_found").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (table) => {
    return {
      nameIndex: index("name_index").on(table.username),
    };
  },
);
