/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import NextAuth, { type AuthOptions, type User } from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import jwt from "jsonwebtoken"
import { type JWT } from "next-auth/jwt"
import { type AdapterUser } from "next-auth/adapters";
import { type Session } from "next-auth/core/types";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    })
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/require-await
    async session({ session, user }: { session: Session; user: User | AdapterUser; token: JWT; }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET

      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        return {
          ...session,
          ...user,
          supabaseAccessToken: jwt.sign(payload, signingSecret)
        }
      }
      return {
        ...session,
        ...user,
        text: "no secret"
      }
    },
  },
}
export default NextAuth(authOptions)
