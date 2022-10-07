import { NextFunction, Response } from "express";
import { log } from "../log";
import { LunchApolloRequest } from "../types";
import dayjs from "dayjs";

export const format = (
  req: LunchApolloRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.menu) {
    return next(Error("Formatter did not receive menu data"));
  }
  log("[middleware:format] formatting message from menu data");
  req.message = formatMenuReply(req.menu, req.date);
  next();
};

function formatMenuReply(menu: string[][], date: Date | undefined): string {
  const options = {
    weekday: "long" as const,
    year: "numeric" as const,
    month: "long" as const,
    day: "numeric" as const,
  };
  const formattedDate = date
    ? date.toLocaleDateString("da-DK", options)
    : "Dagens menu";

  return `**${formattedDate}**\n\n${menu
    .map((entry) => entry.join(": "))
    .join("\n\n")}\n\nVelbekomme!`;
}
