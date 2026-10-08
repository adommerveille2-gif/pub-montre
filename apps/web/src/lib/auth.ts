import "server-only";
import NextAuth, { type DefaultSession } from "next-auth";
import type {} from "next-auth/adapters";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, type Role } from "@pub-montre/db";
import { getEnv } from "./env";
import { sendMagicLink } from "./mailer";

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: Role;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Sessions en base : révocables côté serveur, pas de données sensibles dans un jeton.
  session: { strategy: "database" },
  providers: [
    Nodemailer({
      from: getEnv().EMAIL_FROM,
      // Requis par Auth.js. L'envoi réel passe par sendVerificationRequest (mailer.ts), donc ce transport n'est pas utilisé.
      server: getEnv().SMTP_URL ?? "smtp://localhost:25",
      sendVerificationRequest: ({ identifier, url }) => sendMagicLink({ to: identifier, url }),
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verifier",
    error: "/login",
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role;
      return session;
    },
  },
});
