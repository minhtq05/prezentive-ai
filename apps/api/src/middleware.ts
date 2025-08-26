import { auth } from "@video/auth";
import { db, sql } from "@video/db";
import { fromNodeHeaders } from "better-auth/node";
import { NextFunction, Request, Response } from "express";

// Auth middleware to validate session and set user context
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const headers = req.headers;

    headers["set-cookie"] = (headers.cookie || "")
      .split(";")
      .map((cookie) => cookie.trim());

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });

    if (!session) {
      return res.status(401).send("Unauthorized");
    }

    // Set user context for RLS policies
    await db.execute(sql.raw(`SET app.current_user_id = ${session.user.id}`));

    // Attach user to request object
    (req as any).user = session.user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).send("Unauthorized");
  }
};
