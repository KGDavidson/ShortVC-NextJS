import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import NextAuth, { AuthOptions, Session, User } from "next-auth"
import GitHubProvider from "next-auth/providers/github";
import jwt from "jsonwebtoken"
import { JWT } from "next-auth/jwt"

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
    async session({ session, user }: { session: Session; user: User; token: JWT; }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
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
      return session
    },
  },
}
export default NextAuth(authOptions)
