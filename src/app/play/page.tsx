import { MainGame } from "../_components/main-game";

export default async function Play() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      <MainGame />
    </main>
  );
}
