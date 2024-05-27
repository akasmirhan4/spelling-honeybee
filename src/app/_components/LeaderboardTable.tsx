"use server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cache } from "~/lib/cache";
import { db } from "~/server/db";
import { GameVersion } from "~/server/db/schema";

const getLeaderboard = cache(
  (gameVersion: GameVersion, dateDisplay: string) => {
    console.log("Fetching leaderboard");
    const leaderboard = db.query.leaderboard.findMany({
      where: (data, { eq, and }) =>
        and(
          eq(data.gameVersion, gameVersion),
          eq(data.dateDisplay, dateDisplay),
        ),
      orderBy: (data, { desc }) => desc(data.score),
    });
    return leaderboard;
  },
  ["/play", "getLeaderboard"],
  {
    revalidate: 10,
  },
);

type LeaderboardTableProps = {
  gameVersion: GameVersion;
  dateDisplay: string;
};
export default async function LeaderboardTable({
  gameVersion,
  dateDisplay,
}: LeaderboardTableProps) {
  const leaderboard = await getLeaderboard(gameVersion, dateDisplay);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10em]">Username</TableHead>
          <TableHead className="w-[8em]">{`Rank (Score)`}</TableHead>
          <TableHead className="w-[4em]"># Words</TableHead>
          <TableHead className="w-[1em]">🎉</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>{`${user.rank} (${user.score})`}</TableCell>
            <TableCell>{user.nSubmittedWords}</TableCell>
            <TableCell>{user.pangramFound ? "✅" : "❌"}</TableCell>
          </TableRow>
        ))}
        {leaderboard.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              Why y'all not playing this game??? 😢
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
