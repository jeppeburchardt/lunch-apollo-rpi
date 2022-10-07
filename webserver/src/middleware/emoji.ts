import { NextFunction, Response } from "express";
import { log } from "../log";
import { LunchApolloRequest } from "../types";

export const emoji = (
  req: LunchApolloRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.message) {
    return next();
  }

  log("[middleware:emoji] applying emojis to message");
  const table: Record<string, string> = { s: "🐖", n: "🌰", g: "🌾", l: "🥛" };
  req.message = req.message.replaceAll(/\(([^)]+)\)/gm, (_, match) => {
    return match
      .split(",")
      .map((t: string) => t.trim().toLowerCase())
      .map((c: string) => table[c] || c)
      .join("");
  });
  next();
};
