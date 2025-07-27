import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export const {
  handlers: { GET, POST }, // <- export *functions*, not the whole object
  auth, // (optional) re-export for server components
} = NextAuth(authOptions);
