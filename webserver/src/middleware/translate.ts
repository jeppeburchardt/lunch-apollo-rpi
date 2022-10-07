import { NextFunction, Response } from "express";
import { log } from "../log";
import { LunchApolloRequest } from "../types";
// import translate from "translate";

export const translate = (
  req: LunchApolloRequest,
  res: Response,
  next: NextFunction
) => {
  const { message, incomingChatMessage } = req;

  if (!message || !incomingChatMessage) {
    return next();
  }

  const findLang = incomingChatMessage.match(/-Translate\W([a-z]{2})/im);

  if (!findLang) {
    return next();
  }

  const lang = findLang[1] || "en";
  log(`[middleware:emoji] translating message to ${lang}`);

  //   req.message;
  next();
};
