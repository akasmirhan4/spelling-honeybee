import Link from "next/link";
import { NYTButton } from "../_components/NYTButton";
import { LucideHome } from "lucide-react";
import ShareButton from "../_components/ShareButton";
import LeaderboardButton from "../_components/LeaderboardButton";
import { Button } from "~/components/ui/button";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex max-h-screen w-screen flex-col items-center overflow-hidden bg-white text-black">
      {/* topbar */}
      <nav className="fixed top-0 z-50 flex h-12 w-full items-center justify-center border border-gray-300 bg-white">
        <div className="md:container flex h-full justify-between w-full mx-2">
          <div className="flex h-full flex-1 items-center gap-0">
            <Button asChild variant="ghost">
              <Link href="/">
                <LucideHome size={24} />
              </Link>
            </Button>
          </div>
          <div className="flex h-full flex-1 items-center justify-end gap-0">
            <ShareButton />
            <LeaderboardButton />
            <NYTButton />
          </div>
        </div>
      </nav>
      <div className="md:container px-2 mt-12 w-full">{children}</div>
    </main>
  );
}
