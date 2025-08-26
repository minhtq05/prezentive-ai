import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { keys } from "./keys";

const { DATABASE_URL } = keys();

let _db: ReturnType<typeof drizzle> | null = null;

function getDB() {
  if (!_db) {
    if (!DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const pool = new Pool({
      connectionString: DATABASE_URL,
    });
    _db = drizzle({ client: pool });
  }
  return _db;
}

export const db = getDB();
export * as schema from "./schema";

export {
  and,
  eq,
  exists,
  inArray,
  isNotNull,
  isNull,
  not,
  notExists,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
