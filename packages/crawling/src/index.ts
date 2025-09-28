import { connectDatabase } from "@vocaloid-birthday/database";
import { crawlingFromVocaDB } from "./crawling";
import dotenv from "dotenv";

// .env파일 활성화
dotenv.config();

(async () => {
  const debug = false;
  await connectDatabase({ debug });

  await crawlingFromVocaDB({ debug });
})();
