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
      orderBy: (data, { asc }) => asc(data.score),
    });
    return leaderboard;
  },
  ["/play", "getLeaderboard"],
);

type LeaderboardTableProps = {
  gameVersion: "AK" | "NYT";
};
export default async function LeaderboardTable({
  gameVersion,
}: LeaderboardTableProps) {
  console.log({ gameVersion });
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
        {(await getLeaderboard(gameVersion)).map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.username}</TableCell>
            <TableCell>{`${user.rank} (${user.score})`}</TableCell>
            <TableCell>{user.nSubmittedWords}</TableCell>
            <TableCell>{user.pangramFound ? "✅" : "❌"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
