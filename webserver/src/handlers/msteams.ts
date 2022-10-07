import { Response } from "express";
import { LunchApolloRequest } from "../types";

export async function msteams(req: LunchApolloRequest, res: Response) {
  const message = req.message;
  return res
    .set("Content-Type", "application/json")
    .status(200)
    .send(JSON.stringify({ type: "message", text: message }));
}
