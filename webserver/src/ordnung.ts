import fetch from "node-fetch";
import { log } from "./log";
import textract from "textract";

const { ORDNUNG_USER, ORDNUNG_PASS } = process.env;
const findRVT = /"([A-Z0-9a-z_-]{155})"/;
const findDOCX = /([^"]*docx)/;

const ORDNUNG_URL = "https://ordnungbooking.azurewebsites.net";
const ORDNUNG_LOGIN_URL = `${ORDNUNG_URL}/Account/Login`;
const ORDNUNG_MENU_URL = `${ORDNUNG_URL}/UgensMenu`;

log(`Using credentials ${ORDNUNG_USER} ${ORDNUNG_PASS}`);

if (!ORDNUNG_USER || !ORDNUNG_PASS) {
  throw Error("Missing credentials ENV vars ORDNUNG_USER and ORDNUNG_PASS");
}

async function fetchWeekMenuDocx(): Promise<string> {
  log("[ordnung] fetching menu documnt...");

  const loginPageFetch = await fetch(ORDNUNG_LOGIN_URL);
  const loginPageCookies = loginPageFetch.headers.raw()["set-cookie"];
  const loginPageHtml = await loginPageFetch.text();
  const token = (loginPageHtml.match(findRVT) || [""])[1];

  const loginParams = new URLSearchParams();
  loginParams.append("Email", ORDNUNG_USER || "");
  loginParams.append("Password", ORDNUNG_PASS || "");
  loginParams.append("__RequestVerificationToken", token);
  loginParams.append("RememberMe", "false");

  log("[ordnung] logging on to Ordnung website");
  const loginFetch = await fetch(ORDNUNG_LOGIN_URL, {
    method: "POST",
    redirect: "manual",
    body: loginParams,
    headers: {
      Cookie: loginPageCookies.join(),
    },
  });
  const loginCookies = loginFetch.headers.raw()["set-cookie"];

  const menuPageFetch = await fetch(ORDNUNG_MENU_URL, {
    headers: { Cookie: [...loginPageCookies, ...loginCookies].join() },
    redirect: "manual",
  });
  const menuPageHtml = await menuPageFetch.text();
  const link = (menuPageHtml.match(findDOCX) || [""])[1];

  log(`[ordnung] found link {link}`);

  return link;
}

function downloadDocxMenuToString(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    log("[ordnung] downloading docx file: ", url);
    try {
      textract.fromUrl(
        encodeURI(url),
        { preserveLineBreaks: true },
        (error, text) => {
          if (error) {
            log("[ordnung] downloadDocxMenuToString textract.error", error);
            reject(error);
          }
          resolve(text);
        }
      );
    } catch (e) {
      log("[ordnung] downloadDocxMenuToString.catch", e);
      reject(e);
    }
  });
}

function parseMenuToObject(text: string): string[][][] {
  return text
    .split(/mandag|tirsdag|onsdag|torsdag|fredag/gim)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((day) =>
      day
        .split("\n")
        .map((d) => d.trim())
        .filter(Boolean)
        .map((entry) => entry.split(":").map((e) => e.trim()))
    );
}

export async function fetchMenu(): Promise<string[][][]> {
  const docUrl = await fetchWeekMenuDocx();
  const menuString = await downloadDocxMenuToString(docUrl);
  return parseMenuToObject(menuString);
}
