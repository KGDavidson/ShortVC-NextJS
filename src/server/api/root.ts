/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// -- (next_auth.uid() = user_id)

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */


// Now you can query with RLS enabled.

const sessionZod = z.object({
  supabaseAccessToken: z.string().optional(),
  user: z.object({
    id: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
  }).optional().nullable(),
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  expires: z.string().optional().nullable(),
}).nullable() 

export const appRouter = createTRPCRouter({
  updateUserShortenedUrl: publicProcedure
    .input(z.object({ session: sessionZod, hashUrl: z.string(), newUrl: z.string() }))
    .mutation(async ({ ctx: { supabase }, input: { session, hashUrl, newUrl } }) => {
      const { data: unHashData, error: unHashError } = await supabase.rpc('unhash', {hash: hashUrl})

      if (!unHashData || unHashError) return { error: unHashError?.message }

      const { error } = await supabase
        .from('shortened_urls')
        .update({ url_original: newUrl })
        .eq('url_hash', parseInt((unHashData as string).replace(/[{}]/, ''), 10))
        .eq('user_id', session?.id)

      if (error) return { error: error?.message }

      return {};
    }),
  deleteUserShortenedUrl: publicProcedure
    .input(z.object({ session: sessionZod, hashUrl: z.string() }))
    .mutation(async ({ ctx: { supabase }, input: { session, hashUrl } }) => {
      const { data: unHashData, error: unHashError } = await supabase.rpc('unhash', {hash: hashUrl})

      if (!unHashData || unHashError) return { error: unHashError?.message }

      const { error } = await supabase
        .from('shortened_urls')
        .delete()
        .eq('url_hash', parseInt((unHashData as string).replace(/[{}]/, ''), 10))
        .eq('user_id', session?.id)
      
      if (error) return { error: error?.message }

      return {};
    }),
  getUserShortenedUrls: publicProcedure
    .input(z.object({ session: sessionZod }))
    .query(async ({ ctx: { supabase }, input: { session } }) => {
      const { data: unHashData, error: unHashError } = await supabase.rpc('unhash', {hash: 'eJr'})

      if (!unHashData || unHashError) return { error: unHashError?.message }

      const { data, error } = await supabase.rpc('getuserurls', {uid: session?.id})
      
      if (!data || error) return { error: error?.message }

      return {
        shortenedUrls: data,
      };
    }),
  getOriginalUrl: publicProcedure
    .input(z.object({ hashUrl: z.string() }))
    .query(async ({ ctx: { supabase }, input: { hashUrl } }) => {
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
    .input(z.object({ session: sessionZod, originalUrl: z.string() }))
    .mutation(async ({ ctx: { supabase }, input: { session, originalUrl } }) => {
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
