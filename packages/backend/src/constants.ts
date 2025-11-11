import { join } from "path";

export const staticFolder =
  process.env.NODE_ENV === "production"
    ? (process.env.UPLOADS_PATH as string)
    : join(process.cwd(), "..", "database", "uploads");
