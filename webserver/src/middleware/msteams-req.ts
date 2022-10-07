import { NextFunction, Response } from "express";
import { log } from "../log";
import { LunchApolloRequest } from "../types";

export const msTeamsRequest = (
  req: LunchApolloRequest,
  _: Response,
  next: NextFunction
) => {
  req.incomingChatMessage = req.body?.text ?? "";
  log(`[middleware:msteams-request] "${req.incomingChatMessage}"`);
  next();
};
