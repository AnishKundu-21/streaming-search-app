import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

/**
 * Central NextAuth configuration
 * – Prisma adapter (MongoDB via Prisma)
 * – Google OAuth
 * – Email + password (Credentials provider)
 */
export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),

  providers: [
    /* Google one-click sign-in */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    /* Classic email / password sign-in */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Type assertions to fix TypeScript inference issues
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        /* look up the user in Prisma */
        const user = await prisma.user.findUnique({
          where: { email: email },
        });
        if (!user || !user.password) return null;

        /* compare hashed password */
        const ok = await compare(password, user.password);
        if (!ok) return null;

        /* return minimal session user */
        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          image: user.image ?? null,
        };
      },
    }),
  ],

  // ✅ ADD THIS: Configure session callback to include user.id
  callbacks: {
    async session({ session, token }) {
      // Add user.id to the session from the token
      if (token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Store user.id in the JWT token when user signs in
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },

  pages: { signIn: "/auth/signin" }, // use our custom page
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
