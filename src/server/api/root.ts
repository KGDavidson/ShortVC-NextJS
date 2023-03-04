// -- (next_auth.uid() = user_id)

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

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
  getOriginalUrl: publicProcedure
    .input(z.object({ hashUrl: z.string() }))
    .query(async ({ ctx, input: { hashUrl } }) => {
      const {
        supabase
      } = ctx

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data: unHashData, error: unHashError } = await supabase.rpc('unhash', {hash: hashUrl})

      if (!unHashData || unHashError) return { error: unHashError?.message }

      const unHashedIndex = parseInt((unHashData as string).replace(/[{}]/, ''), 10)

      const { data, error } = await supabase
        .from('shortened_urls')
        .select('url_original')
        .eq('url_hash', unHashedIndex)
        .single()
      
      if (!data || error) return { error: error?.message }

      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        originalUrl: data.url_original,
      };
    }),
  shortenUrl: publicProcedure
    .input(z.object({ originalUrl: z.string() }))
    .mutation(async ({ ctx, input: { originalUrl } }) => {

      const {
        session,
        supabase
      } = ctx

      const { data, error } = await supabase
        .from('shortened_urls')
        .insert({ 
          url_original: originalUrl, 
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          user_id: session ? session.id : undefined 
        })
        .select('*')

      if (!data || error) return { error: error.message }
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data: hashData, error: hashError } = await supabase.rpc('hash', {id: data[0]?.url_hash})
      
      if (hashError) return { error: hashError?.message }

      return {
        originalUrl,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        hashUrl: hashData,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
