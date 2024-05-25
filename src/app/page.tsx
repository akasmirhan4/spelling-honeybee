import Link from "next/link";
import { SubscribeButton } from "./_components/subscribe-button";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-yellow text-black">
      <div className="md:container flex flex-col items-center justify-center gap-8 px-4 md:gap-12">
        <Image
          width={96}
          height={96}
          src="imgs/spelling-bee-icon.svg"
          alt="Spelling Bee"
          className="md:h-32 md:w-32"
        />
        <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-[3rem]">
          Spelling HoneyBee
        </h1>
        <h5 className="text-center text-2xl font-light tracking-tight md:text-[2rem] ">
          How many words can you make with 7 letters?
        </h5>
        <div className="flex flex-col gap-4">
          <Button
            asChild
            className="min-w-64 rounded-full bg-black p-8 text-2xl text-white active:bg-black/80 md:hover:bg-black/80"
          >
            <Link href="/play" target="_self">
              Play
            </Link>
          </Button>
          <SubscribeButton />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="md:text-1xl text-xl font-semibold">
            {/* today's date as Month Date, Year*/}
            {new Date().toLocaleDateString("en-SG", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
          <p className="md:text-1xl text-xl">Edited by Amirrul Kasmirhan</p>
        </div>
      </div>
    </main>
  );
}
