import { useState } from "react";
import { GameInput } from "../_components/game-input";

export default async function Play() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col">
          {/* input */}
          <GameInput />
        </div>
        <div className="flex flex-1"></div>
      </div>
    </main>
  );
}

