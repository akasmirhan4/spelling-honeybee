import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type Phonetic = {
  audio: string;
  text: string;
  sourceUrl: string;
  license: {
    name: string;
    url: string;
  };
};

type Definition = {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
};

type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
};

type DictionaryEntry = {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: {
    name: string;
    url: string;
  };
  sourceUrls: string[];
};

type NotFoundResponse = {
  title: string;
  message: string;
  resolution: string;
};

export const dictionaryRouter = createTRPCRouter({
  isWordExist: publicProcedure
    .input(z.object({ word: z.string() }))
    .mutation(async ({ input }) => {
      const api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
      const url = `${api}${input.word}`;
      console.log({ url });
      const isExist = await fetch(url)
        .then((res) => res.json() as Promise<DictionaryEntry[] | NotFoundResponse>)
        .then((data) => {
          return Array.isArray(data) && data.length > 0;
        });
      return {
        isExist,
      };
    }),
});
