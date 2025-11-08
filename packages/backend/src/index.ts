import { connectDatabase } from "@vocaloid-birthday/database";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import authMiddleware from "./auth/authMiddleware";
import login from "./auth/login";
import saveSvg from "./progress/saveSvg";
import upload from "./progress/upload";
import song from "./calendar/songs";
import refresh from "./auth/refresh";
import progress from "./progress/progress";
import { initTokenDB } from "./auth/refreshTokenDB";
import logout from "./auth/logout";

dotenv.config();

const app: Express = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.set("port", process.env.PORT || port);

app.get("/api/songs", song);
app.get("/api/progress", progress);

app.post("/api/auth/login", login);
app.post("/api/auth/logout", logout);
app.post("/api/auth/refresh", refresh);

app.post("/api/admin/save", authMiddleware, upload.single("svgFile"), saveSvg);

const startServer = async () => {
  await connectDatabase({ debug: false });
  await initTokenDB();
  app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중!");
  });
};

startServer();
