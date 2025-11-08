import { Low } from "lowdb";
import { JSONFilePreset } from "lowdb/node";
import path from "path";
import type { RefreshTokenData } from "../types";

const defaultData: RefreshTokenData = { refreshTokens: [] };
const file = path.join(process.cwd(), "db.json");

let refreshTokenDB: Low<RefreshTokenData>;

async function initTokenDB() {
  if (!refreshTokenDB) {
    refreshTokenDB = await JSONFilePreset<RefreshTokenData>(file, defaultData);
  }
  return refreshTokenDB;
}

export { refreshTokenDB, initTokenDB };
