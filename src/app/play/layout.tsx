import Link from "next/link";
import { WSJButton } from "../_components/wsj-button";
import { LucideHome } from "lucide-react";
import ShareButton from "../_components/ShareButton";
import LeaderboardButton from "../_components/LeaderboardButton";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex max-h-screen w-screen flex-col items-center overflow-hidden bg-white text-black">
      {/* topbar */}
      <nav className="fixed top-0 z-50 flex h-12 w-full items-center justify-center border border-gray-300">
        <div className="container flex h-full justify-between">
          <div className="flex h-full flex-1 items-center">
            <Link
              href="/"
              className="flex h-full items-center px-2 text-xs font-bold md:hover:bg-primary/50 ease-in-out transition-all active:bg-primary/50"
            >
              <LucideHome size={24} />
            </Link>
          </div>
          <div className="flex h-full flex-1 items-center justify-end">
            <ShareButton />
            <LeaderboardButton />
            <WSJButton />
          </div>
        </div>
      </nav>
      <div className="container mt-12">{children}</div>
    </main>
  );
}
