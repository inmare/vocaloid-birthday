import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import path from "path";
import type { RefreshTokenData } from "../types";

const defaultData: RefreshTokenData = { refreshTokens: [] };
const tokenDBPath =
  process.env.NODE_ENV === "production"
    ? path.join(process.env.TOKEN_DB_PATH as string)
    : path.join(process.cwd(), "..", "database", "refresh_token_db.json");
const file = tokenDBPath;

let refreshTokenDB: Low<RefreshTokenData>;

async function initTokenDB() {
  if (!refreshTokenDB) {
    refreshTokenDB = await JSONFilePreset<RefreshTokenData>(file, defaultData);
  }
  return refreshTokenDB;
}

export { refreshTokenDB, initTokenDB };
