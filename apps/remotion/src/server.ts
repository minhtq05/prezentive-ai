import { auth } from "@video/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import getRendersRouter from "./routes/render";

async function main() {
  const app = express();
  const port = 3002;

  app.all("/api/auth/*splat", toNodeHandler(auth));

  // Middleware to parse JSON
  app.use(express.json());

  // CORS middleware
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? "http://localhost:5000"
          : "http://localhost:3000", // Replace with your frontend's origin
      methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
      credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    })
  );

  app.use("/api/render", await getRendersRouter());

  app.get("/", (req, res) => {
    res.send("Remotion API Server");
  });

  app
    .listen(port, () => {
      console.log(`Remotion API server listening on port ${port}`);
    })
    .on("error", (err) => {
      console.error("Failed to start server:", err);
    });
}

main();
