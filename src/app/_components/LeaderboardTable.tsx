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

const getLeaderboard = cache(
  (gameVersion: "AK" | "NYT") => {
    const leaderboard = db.query.leaderboard.findMany({
      where: (data, { eq }) => eq(data.gameVersion, gameVersion),
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
  gameVersion: "AK" | "NYT";
};
export default async function LeaderboardTable({
  gameVersion,
}: LeaderboardTableProps) {
  const leaderboard = await getLeaderboard(gameVersion);
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
