import Link from "next/link";
import { NYTButton } from "../_components/NYTButton";
import { LogIn, LucideHome, UserCircle } from "lucide-react";
import ShareButton from "../_components/ShareButton";
import LeaderboardButton from "../_components/LeaderboardButton";
import { Button } from "~/components/ui/button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex max-h-screen w-screen flex-col items-center overflow-hidden bg-white text-black">
      <Navbar />
      <div className="mt-12 w-full px-2 md:container">{children}</div>
    </main>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-12 w-full items-center justify-center border border-gray-300 bg-white">
      <div className="mx-2 flex h-full w-full justify-between md:container">
        <div className="flex h-full flex-1 items-center gap-0">
          <Button asChild variant="ghost">
            <Link href="/">
              <LucideHome size={24} />
            </Link>
          </Button>
          <NYTButton />
        </div>
        <div className="flex h-full flex-1 items-center justify-end gap-0">
          <ShareButton />
          <LeaderboardButton />
          <SignedOut>
            <SignInButton>
              <Button variant="ghost">
                <UserCircle size={24} />
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
