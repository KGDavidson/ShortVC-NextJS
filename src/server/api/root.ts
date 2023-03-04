// -- (next_auth.uid() = user_id)

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { getServerSession } from "next-auth";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */


// Now you can query with RLS enabled.


// supabase 2afutZQyHl2kMnRt


// add: t.procedure.input(validationSchema).mutation(({ input }) => {
//   const id = Math.random()
//     .toString(36)
//     .replace(/[^a-z]+/g, '')
//     .slice(0, 6);
//   const item = {
//     id,
//     ...input,
//   };
//   items.push(item);

//   return item;
// }),

export const appRouter = createTRPCRouter({
  shortenUrl: publicProcedure
    .input(z.object({ originalUrl: z.string() }))
    .mutation(async ({ ctx, input: { originalUrl } }) => {

      const {
        session,
        supabase
      } = ctx as any

      const { data, error } = await supabase
        .from('shortened_urls')
        .insert({ 
          url_original: originalUrl, 
          user_id: session ? session.id : undefined 
        })
        .select('*')
      
      const { data: hashData, error: hashError } = await supabase.rpc('hash', {id: data[0].url_hash})

      return {
        originalUrl,
        hashUrl: hashData,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;