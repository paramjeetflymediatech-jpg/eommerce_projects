import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "./models";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "shopnest-super-secret-jwt-key-2024");

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isAdminLogin: { label: "isAdminLogin", type: "hidden" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await User.findOne({ where: { email: credentials.email } });
        if (!user) return null;

        // Block Admin accounts from the default customer storefront login 
        // unless they are explicitly using the admin login portal
        if (user.role === "ADMIN" && credentials.isAdminLogin !== "true") {
          throw new Error("ADMIN_NOT_ALLOWED_IN_STOREFRONT");
        }

        // Block unverified users from logging in
        if (!user.isVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;

        // Save the manual identifier/token to User table on sign-in
        try {
          const dbUser = await User.findByPk(user.id);
          if (dbUser) {
             const jwtToken = await new jose.SignJWT({ id: user.id, email: user.email, role: user.role })
               .setProtectedHeader({ alg: "HS256" })
               .setIssuedAt()
               .setExpirationTime("30d")
               .sign(JWT_SECRET);
             
             await dbUser.update({ token: jwtToken });
          }
        } catch (e) {
          console.error("Failed to save JWT to DB:", e);
        }
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
  },
  events: {
    async signOut({ token, session }: { token: any; session: any }) {
      if (token?.id) {
        try {
          await User.update({ token: null }, { where: { id: token.id } });
        } catch (e) {
          console.error("Failed to clear token on signout:", e);
        }
      }
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
