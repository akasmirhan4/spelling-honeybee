import Link from "next/link";
import { SubscribeButton } from "./_components/subscribe-button";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-primary text-black">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 md:gap-12">
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
          <Button asChild className="min-w-64 rounded-full bg-black p-8 text-white md:hover:bg-black/80 active:bg-black/80 text-2xl">
            <Link href="/play" target="_self">
              Play
            </Link>
          </Button>
          <SubscribeButton />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-semibold md:text-1xl">
            {/* today's date as Month Date, Year*/}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-xl md:text-1xl">Edited by Amirrul Kasmirhan</p>
        </div>
      </div>
    </main>
  );
}
