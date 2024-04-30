import Link from "next/link";
import { SubscribeButton } from "./_components/subscribe-button";
import Image from "next/image";

export default async function Home() {

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-primary text-black overflow-hidden">
      <div className="container flex flex-col items-center justify-center gap-8 md:gap-12 px-4">
        <Image
          width={96}
          height={96}
          src="imgs/spelling-bee-icon.svg"
          alt="Spelling Bee"
          className="md:h-32 md:w-32"
        />
        <h1 className="text-3xl font-extrabold tracking-tight md:text-[5rem] text-center">
          Spelling HoneyBee
        </h1>
        <h5 className="text-center text-2xl font-light tracking-tight md:text-[2.5rem] ">
          How many words can you make with 7 letters?
        </h5>
        <div className="flex flex-col gap-4">
          <Link
            className="flex min-w-64 max-w-xs flex-col rounded-full bg-black p-8 text-center text-white transition-all ease-out hover:bg-black/80"
            href="/play"
            target="_self"
          >
            <h3 className="text-2xl font-bold">Play</h3>
          </Link>
          <SubscribeButton />
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl md:text-2xl font-semibold">
            {/* today's date as Month Date, Year*/}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-xl md:text-2xl">Edited by Amirrul Kasmirhan</p>
        </div>
      </div>
    </main>
  );
}