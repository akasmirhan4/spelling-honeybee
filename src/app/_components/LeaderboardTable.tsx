"use server";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "~/server/db";

type LeaderboardTableProps = {
  gameVersion: "AK" | "NYT";
};
export default async function LeaderboardTable({
  gameVersion,
}: LeaderboardTableProps) {
  const leaderboard = await db.query.userScore.findMany({
    where: (data, { eq }) => eq(data.gameVersion, gameVersion),
    orderBy: (data, { asc }) => asc(data.score),
  });
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
      </TableBody>
    </Table>
  );
}
