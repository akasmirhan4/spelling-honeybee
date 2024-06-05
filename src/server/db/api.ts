"use server";

import { eq, and } from "drizzle-orm";
import * as schema from "./schema";
import { db } from ".";
import { cache } from "~/lib/cache";

type updateOrCreateLeaderboardEntryType = {
  userId: string;
  username: string;
  score: number;
  dateDisplay: string;
  rank: schema.ScoreRankNameType;
  gameVersion: schema.GameVersion;
  submittedWords: string[];
  pangramFound: boolean;
};

export const updateOrCreateLeaderboardEntry = cache(
  async ({
    userId,
    username,
    score,
    rank,
    gameVersion,
    dateDisplay,
    submittedWords,
    pangramFound,
  }: updateOrCreateLeaderboardEntryType) => {
    const leaderboardEntry = await db.query.leaderboard.findFirst({
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.userId, userId),
          operators.eq(fields.dateDisplay, dateDisplay),
          operators.eq(fields.gameVersion, gameVersion),
        ),
    });
    console.log("Found leaderboard entry");
    console.log({ leaderboardEntry });
    if (!!leaderboardEntry) {
      console.log("updating...");
      console.log({
        userId,
        username,
        score,
        rank,
        gameVersion,
        submittedWords,
        nSubmittedWords: submittedWords.length,
        pangramFound,
      });
      await db
        .update(schema.leaderboard)
        .set({
          username,
          rank,
          score,
          submittedWords,
          nSubmittedWords: submittedWords.length,
          pangramFound,
        })
        .where(and(eq(schema.leaderboard.id, leaderboardEntry.id)));
    } else {
      console.log("inserting...");
      console.log({
        userId,
        username,
        score,
        rank,
        gameVersion,
        submittedWords,
        nSubmittedWords: submittedWords.length,
        pangramFound,
      });
      await db.insert(schema.leaderboard).values({
        userId,
        username,
        score,
        rank,
        dateDisplay,
        gameVersion,
        submittedWords,
        nSubmittedWords: submittedWords.length,
        pangramFound,
      });
    }
  },
  ["/play", "updateOrCreateLeaderboardEntry"],
  {
    revalidate: 5,
  },
);

export const getUserLeaderboardEntries = async (
  userId: string,
  gameVersion: schema.GameVersion,
  dateDisplay: string,
) => {
  return await db.query.leaderboard.findMany({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.userId, userId),
        operators.eq(fields.gameVersion, gameVersion),
        operators.eq(fields.dateDisplay, dateDisplay),
      ),
  });
};
