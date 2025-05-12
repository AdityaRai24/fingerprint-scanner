import { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password){
          throw new Error("Missing credentials");
        }

        const user = await db.user.findFirst({
          where: {
            email: credentials.email
          }
        });

        if(!user?.password || !user.email){
          throw new Error("Invalid credentials");
        }

        const correctPassword = await bcrypt.compare(credentials.password, user.password);

        if(!correctPassword){
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || undefined,
        };
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  },
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/signin",
  },
}