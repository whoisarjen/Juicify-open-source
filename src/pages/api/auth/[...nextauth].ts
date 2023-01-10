import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
    callbacks: {
        async signIn({ user }) {
            if ((user as unknown as User).isBanned) {
                return false
            }

            return true
        },
        async session({ session, user }) {
            return {
                ...session,
                user: user as unknown as User | null,
            }
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    emailVerified: profile.email_verified,
                    image: profile.picture,
                    locale: profile.locale,
                    name: profile.given_name,
                    surname: profile.family_name,
                }
            }
        }),
        DiscordProvider({
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
            profile(profile) {
                if (profile.avatar !== null) {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }

                return {
                    id: profile.id,
                    username: profile.username,
                    email: profile.email,
                    emailVerified: new Date(),
                    image: profile.image_url,
                    locale: profile.locale,
                }
            },
        }),
    ],
    pages: {
        signIn: '/',
    },
};

export default NextAuth(authOptions);
