import { type Permission, type User } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
    interface Session {
        user: null | User & { permissions?: Permission[] }
    }
}