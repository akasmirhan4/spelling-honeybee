import Link from "next/link";
import { MainGame } from "../_components/main-game";
import { WSJButton } from "../_components/wsj-button";

export default async function Play() {
  return (
    <main className="flex max-h-screen w-screen flex-col items-center overflow-hidden bg-white text-black">
      {/* topbar */}
      <div className="border-grey fixed top-0 z-50 flex h-12 w-full items-center justify-center border">
        <div className="container flex justify-between h-full">
          <div className="flex-1" />
          <div className="flex h-full flex-1 items-center justify-end">
            <WSJButton />
            <Link
              href="/"
              className="flex h-full items-center px-6 text-xs font-bold hover:bg-primary/50"
            >
              <h1>Home</h1>
            </Link>
          </div>
        </div>
      </div>
      <div className="container mt-12">
        <MainGame />
      </div>
    </main>
  );
}
