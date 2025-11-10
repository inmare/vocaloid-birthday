import { connectDatabase } from "@vocaloid-birthday/database";
import {
  authRateLimiter,
  login,
  authMiddleware,
  logout,
  refresh,
  initTokenDB,
} from "./auth";
import { songs, calendarData } from "./calendar";
import { progress, saveSvg, upload } from "./progress";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import { frontendFolder, staticFolder } from "./constants";
import { existsSync } from "fs";
import { mkdir } from "fs/promises";
import helmet from "helmet";

dotenv.config();

const app: Express = express();
const port = 3000;

// cors 설정
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://vocalendar.moe",
      "https://www.vocalendar.moe",
    ],
    credentials: true,
  })
);
// 보안 헤더 설정, cross origin일때만 리소스 허용
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "style-src": ["'self'", "'unsafe-inline'"],
        "script-src": ["'self'"],
        "img-src": ["'self'", "blob:", "data:", "https:"],
        "base-uri": ["/", "http:"],
      },
    },
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/static", express.static(staticFolder));

app.set("port", process.env.PORT || port);

app.get("/api/songs", songs);
app.get("/api/progress", progress);
app.get("/api/calendar", calendarData);

app.post("/api/auth/login", authRateLimiter, login);
app.post("/api/auth/logout", logout);
app.post("/api/auth/refresh", refresh);

app.post(
  "/api/admin/save",
  authMiddleware,
  upload.fields([{ name: "svgFile" }, { name: "imageFile" }]),
  saveSvg
);

app.use(express.static(frontendFolder));
app.get(/.*/, (req, res, next) => {
  if (req.originalUrl.startsWith("/api/")) {
    return next();
  }
  res.sendFile("index.html", { root: frontendFolder });
});

const startServer = async () => {
  await connectDatabase({ debug: false });
  await initTokenDB();
  // static 폴더 경로 만들기
  if (!existsSync(staticFolder)) {
    await mkdir(staticFolder);
  }
  app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중!");
  });
};

startServer();
