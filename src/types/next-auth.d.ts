// filepath: src/types/next-auth.d.ts
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role ?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "user" | "admin";
  }
}
