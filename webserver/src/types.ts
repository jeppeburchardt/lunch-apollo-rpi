import dayjs from "dayjs";
import { Request } from "express";

type Maybe<T> = T | null | undefined;

type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";

type MenuEntry = [string, string] | string;

type DayMenu = MenuEntry[];

export type Menu = {
  [key in Day]: Maybe<DayMenu>;
};

export type LunchApolloRequest = Request & {
  menu?: string[][]; // TODO: replace with Menu
  message?: string;
  incomingChatMessage?: string;
  date?: Date;
};

export class MenuNotFoundError extends Error {
  private _date: Date;
  constructor(message: string, date: Date) {
    super(message);
    this.name = "MenuNotFoundError";
    this._date = date;
  }
  get date(): Date {
    return this._date;
  }
}
