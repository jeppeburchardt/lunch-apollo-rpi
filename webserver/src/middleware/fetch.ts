import { NextFunction, Response } from "express";
import { GeoReplyWith, RedisClientType } from "redis";
import { log } from "../log";
import { fetchMenu } from "../ordnung";
import { LunchApolloRequest, MenuNotFoundError } from "../types";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

export const fetch =
  (redis: RedisClientType) =>
  async (req: LunchApolloRequest, res: Response, next: NextFunction) => {
    log("[middleware:fetch] fetching menu data");

    let date = dayjs();
    let dayOfWeek = date.day();
    let week = date.week();
    let year = date.year();
    let key = `${year}_${week}`;
    let isQuery = false;

    if (req.incomingChatMessage) {
      const dateQuery = req.incomingChatMessage.match(
        /\s(\d{1,2}[/]\d{1,2}[/-]\d{4})/gim
      );
      if (dateQuery) {
        date = dayjs(dateQuery[0]);
        week = date.week();
        year = date.year();
        dayOfWeek = date.day();
        key = `${year}_${week}`;
        isQuery = true;
      }
      log(`[middleware:fetch] using query date:${key} ${dayOfWeek}`);
    }

    const cachedMenu = await redis.get(key);
    let menu: string[][][];

    if (cachedMenu) {
      log(`[middleware:fetch] using cached value ${key}`);
      menu = JSON.parse(cachedMenu);
    } else if (isQuery) {
      log(
        `[middleware:fetch] unable to fetch cached menu for date ${date.toString()} using ${key}`
      );
      return next(
        new MenuNotFoundError(`Menu not found for ${date}`, date.toDate())
      );
    } else {
      menu = await fetchMenu();
      const toCacheString = JSON.stringify(menu);
      log(
        `[middleware:fetch] saving cache ${key} "${toCacheString.substring(
          0,
          20
        )}..."`
      );
      await redis.set(key, toCacheString);
    }

    const selectedMenu = menu[dayOfWeek - 1];

    if (!selectedMenu) {
      log(
        `[middleware:fetch] unable to find menu for day ${dayOfWeek} in key ${key}`
      );
      next(new MenuNotFoundError(`Menu not found for ${date}`, date.toDate()));
    }

    req.date = date.toDate();
    req.menu = selectedMenu;

    next();
  };
