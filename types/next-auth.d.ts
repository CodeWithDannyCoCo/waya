import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "parent" | "child"
      parentId?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: "parent" | "child"
    parentId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "parent" | "child"
    parentId?: string
  }
}
