import { Progress } from "../_components/progress";
import { MainGame } from "../_components/main-game";

export default async function Play() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col items-center">
          {/* input */}
          <MainGame />
        </div>
        <div className="flex flex-1 flex-col">
          <Progress />

          {/* word list */}
          <div className="border-gray mr-10 flex flex-1 flex-col rounded-md border">
            <h3 className="px-6 py-4">You have found 1 word</h3>
          </div>
        </div>
      </div>
    </main>
  );
}
