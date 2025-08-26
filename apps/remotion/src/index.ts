import * as dotenv from "dotenv";
import { resolve } from "node:path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: resolve(__dirname, "../.env.local") });
}

import("./server");
