import { db, schema } from "@video/db"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { Resend } from "resend";
import { keys } from "./keys";

const {
  RESEND_API_KEY,
  BETTER_AUTH_EMAIL,
  NEXT_PUBLIC_BETTER_AUTH_URL,
  BETTER_AUTH_SECRET,
} = keys();

const resend = new Resend(RESEND_API_KEY);

const from = BETTER_AUTH_EMAIL;

if (!from) {
  throw Error("BETTER_AUTH_EMAIL is not provided.");
}

const auth = betterAuth({
  appName: "video",
  baseURL: NEXT_PUBLIC_BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const res = await resend.emails.send({
        from,
        to: user.email,
        subject: "Verify your email address",
        html: `<a href="${url}">Verify your email address</a>`,
      });
      console.log(res, user.email);
    },
  },
  // account: {
  //   accountLinking: {
  //     trustedProviders: ["google"],
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from,
        to: user.email,
        subject: "Reset your password",
        html: `<a href="${url}">Reset your password</a>`,
      });
    },
  },
  trustedOrigins: [
    process.env.NODE_ENV === "production"
      ? "http://localhost:5000"
      : "http://localhost:3000",
  ],
  user: {
    modelName: "users",
  },
  session: {
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  plugins: [nextCookies()],
});

export default auth;
