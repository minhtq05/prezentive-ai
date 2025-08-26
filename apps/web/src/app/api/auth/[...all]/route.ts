import auth from "@video/auth/server"; // path to your auth file
import { toNextJsHandler } from "better-auth/next-js";

export const { POST, GET } = toNextJsHandler(auth);

// let handlers;

// try {
//   handlers = toNextJsHandler(auth);
// } catch (err) {
//   console.error("Better Auth handler setup error:", err);
//   throw err;
// }

// export const { GET, POST } = handlers;
