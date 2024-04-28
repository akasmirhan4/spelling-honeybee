import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dictionaryRouter = createTRPCRouter({
  isWordExist: publicProcedure
    .input(z.object({ word: z.string() }))
    .mutation(async ({ input }) => {
      const api = "https://api.dictionaryapi.dev/api/v2/entries/en/";
      const url = `${api}${input.word}`;
      console.log({ url });
      const isExist = await fetch(url)
        .then((res) => res.json())
        .then((data) => {
          return data.length > 0;
        });
      return {
        isExist,
      };
    }),
});
