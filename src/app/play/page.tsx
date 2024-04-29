import { MainGame } from "../_components/main-game";

export default async function Play() {
  return (
    <main className="flex max-h-screen justify-center bg-white text-black overflow-hidden">
      <MainGame />
    </main>
  );
}
