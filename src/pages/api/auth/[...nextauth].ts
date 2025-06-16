import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { compare } from "bcryptjs";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize called", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        const user = await db
          .collection("users")
          .findOne({ email: credentials.email });
        console.log("User found:", user);
        if (!user) {
          console.log("No user found");
          return null;
        }
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        console.log("Password valid:", isPasswordValid);
        if (!isPasswordValid) {
          console.log("Invalid password");
          return null;
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role === "admin" || user.role === "user" ? user.role : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
});
