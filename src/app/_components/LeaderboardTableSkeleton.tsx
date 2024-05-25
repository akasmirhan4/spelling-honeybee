import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export function LeaderboardTableSkeleton() {
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
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Skeleton className="h-4 w-[10em] rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[12em] rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[4em] rounded" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-4 rounded" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
