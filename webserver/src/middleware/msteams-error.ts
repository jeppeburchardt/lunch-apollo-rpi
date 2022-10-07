import { NextFunction, Response } from "express";
import { log } from "../log";
import { LunchApolloRequest, MenuNotFoundError } from "../types";

export const msTeamsError = (
  err: Error,
  req: LunchApolloRequest,
  res: Response,
  next: NextFunction
) => {
  log(`[middleware:error] ${err}`);

  let text = "Der skete en fejl";

  if (err instanceof MenuNotFoundError) {
    text = `Menuen kunne ikke hentes for dato: ${err.date.toLocaleDateString()}. Måske er den ikke opdateret endnu. Prøv igen senere.`;
  }

  return res
    .set("Content-Type", "application/json")
    .status(200)
    .send(JSON.stringify({ type: "message", text }));
};
