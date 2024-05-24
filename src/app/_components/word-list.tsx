"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ScrollArea } from "~/components/ui/scroll-area";

type WordListProps = {
  words: string[];
};

export function WordList({ words }: WordListProps): JSX.Element {
  return <WordListCompact words={words} />;
}

const WordListCompact = ({ words }: WordListProps): JSX.Element => {
  return (
    <Accordion type="single" collapsible className="rounded-xl border px-3">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger>{`You have found ${words.length} word${words.length > 1 ? "s" : ""}`}</AccordionTrigger>
        <AccordionContent>
          <ScrollArea className="h-[30dvh]">
            {words.toReversed().map((word, index) => {
              // if word has 7 unique letters, bold the word
              const uniqueLetters = new Set(word.split(""));
              const isPangram = uniqueLetters.size == 7;
              return (
                <div key={index} className="mr-2 flex items-center">
                  <span className={`${isPangram && "font-bold"}`}>{word}</span>
                </div>
              );
            })}
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
