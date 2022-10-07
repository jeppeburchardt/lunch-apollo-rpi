import bodyParser from "body-parser";
import express from "express";
import { createClient, RedisClientType } from "redis";
import { msteams as msTeamsHandler } from "./handlers/msteams";
import { log } from "./log";
import { emoji } from "./middleware/emoji";
import { fetch } from "./middleware/fetch";
import { format } from "./middleware/format";
import { msTeamsError } from "./middleware/msteams-error";
import { msTeamsRequest } from "./middleware/msteams-req";
import { translate } from "./middleware/translate";

const app = express();
const port = 8080; // default port to listen

const client: RedisClientType = createClient({
  url: "redis://lunch-apollo-cache:6379",
});
client.on("error", (err) => log("[index] Redis Client Error", err));

app.use(bodyParser.json());

app.post(
  "/msteams",
  msTeamsRequest, // parse ms teams chat message request
  fetch(client), // fetch menu from intranet if cache does not exist
  format, // format menu data into a human readable string
  emoji, // add emojis ✌️
  translate,
  msTeamsHandler, // hansle request and response
  msTeamsError
);

client.connect().then(() => {
  log("[index] connected to redis");
  app.listen(port, () => {
    log(`[index] server started at :${port}`);
  });
});
