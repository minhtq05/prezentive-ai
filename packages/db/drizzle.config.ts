import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import { keys } from "./src/keys";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

const { NODE_ENV, DATABASE_URL } = keys();

export default defineConfig({
  out: "./migrations",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL!,
  },
  strict: NODE_ENV === "production",
});
