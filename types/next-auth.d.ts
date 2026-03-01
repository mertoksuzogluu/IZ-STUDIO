import "next-auth"

declare module "next-auth" {
  interface User {
    role?: "user" | "admin"
  }
  interface Session {
    user: User & { role: "user" | "admin" }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "user" | "admin"
  }
}
