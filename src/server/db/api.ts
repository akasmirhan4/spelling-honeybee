"use server";

import { eq, and } from "drizzle-orm";
import * as schema from "./schema";
import { db } from ".";
import { cache } from "~/lib/cache";

type updateOrCreateLeaderboardEntryType = {
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
    username,
    score,
    rank,
    gameVersion,
    dateDisplay,
    nSubmittedWords,
    pangramFound,
  }: updateOrCreateLeaderboardEntryType) => {
    console.log({
      username,
      score,
      rank,
      gameVersion,
      nSubmittedWords,
      pangramFound,
    });
    const leaderboardEntry = await db.query.leaderboard.findFirst({
      where: (fields, operators) => operators.eq(fields.username, username),
    });
    console.log({ leaderboardEntry });
    if (!!leaderboardEntry) {
      console.log("updating...");
      await db
        .update(schema.leaderboard)
        .set({
          rank,
          score,
          nSubmittedWords,
          pangramFound,
        })
        .where(
          and(
            eq(schema.leaderboard.username, username),
            eq(schema.leaderboard.gameVersion, gameVersion),
            eq(schema.leaderboard.dateDisplay, dateDisplay),
          ),
        );
    } else {
      console.log("inserting...");
      await db.insert(schema.leaderboard).values({
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
    revalidate: 60,
  },
);
