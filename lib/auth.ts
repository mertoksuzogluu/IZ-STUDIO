import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : null
        const password =
          typeof credentials?.password === "string" ? credentials.password : null
        if (!email || !password) {
          return null
        }

        const normalizedEmail = email.trim().toLowerCase()

        try {
          const user = await prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: "insensitive" } },
          })

          if (!user) {
            return null
          }

          // Check if user has a password (for users created via credentials)
          const account = await prisma.account.findFirst({
            where: {
              userId: user.id,
              type: "credentials",
            },
          })

          if (!account || !account.password) {
            return null
          }

          // Verify password
          const isValid = await bcrypt.compare(password, account.password)

          if (!isValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub || ""
        session.user.role = (token.role || "user") as "user" | "admin"
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.sub = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
})

// Export authOptions for backward compatibility
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
}
