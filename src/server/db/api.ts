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
  nSubmittedWords: number;
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
    nSubmittedWords,
    pangramFound,
  }: updateOrCreateLeaderboardEntryType) => {
    console.log({
      userId,
      username,
      score,
      rank,
      gameVersion,
      nSubmittedWords,
      pangramFound,
    });
    const leaderboardEntry = await db.query.leaderboard.findFirst({
      where: (fields, operators) =>
        operators.and(
          operators.eq(fields.userId, userId),
          operators.eq(fields.dateDisplay, dateDisplay),
          operators.eq(fields.gameVersion, gameVersion),
        ),
    });
    console.log({ leaderboardEntry });
    if (!!leaderboardEntry) {
      console.log("updating...");
      await db
        .update(schema.leaderboard)
        .set({
          username,
          rank,
          score,
          nSubmittedWords,
          pangramFound,
        })
        .where(and(eq(schema.leaderboard.id, leaderboardEntry.id)));
    } else {
      console.log("inserting...");
      await db.insert(schema.leaderboard).values({
        userId,
        username,
        score,
        rank,
        dateDisplay,
        gameVersion,
        nSubmittedWords,
        pangramFound,
      });
    }
  },
  ["/play", "updateOrCreateLeaderboardEntry"],
  {
    revalidate: 5,
  },
);
