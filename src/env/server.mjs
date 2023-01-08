// @ts-check
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { serverSchema } from "./schema.mjs";
import { env as clientEnv, formatErrors } from "./client.mjs";

const defaultServerEnv = {
  NEXTAUTH_SECRET: "w@yYo%aJ;]#FXj{;j?@d`#48NHrC'eT]5DyLQD@Bv0LWkivPE)~X@sGB,v;ev/)",
  DISCORD_CLIENT_ID: "1056593142381547630",
  DISCORD_CLIENT_SECRET: "xO5xLnwaxH9y2e3O4egNNWfp4R0273fN",
  GOOGLE_CLIENT_ID: "658821628417-vpspbk50qh0qb7cbg6d4h6hd2e9up3h2.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "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",
}

const _serverEnv = serverSchema.safeParse({
  ...process.env,
  ...defaultServerEnv,
});

if (_serverEnv.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_serverEnv.error.format()),
  );
  throw new Error("Invalid environment variables");
}

/**
 * Validate that server-side environment variables are not exposed to the client.
 */
for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    console.warn("❌ You are exposing a server-side env-variable:", key);

    throw new Error("You are exposing a server-side env-variable");
  }
}

export const env = { ..._serverEnv.data, ...clientEnv };
