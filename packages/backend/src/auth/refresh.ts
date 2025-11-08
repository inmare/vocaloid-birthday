import { AdminData } from "../types";
import * as jwt from "jsonwebtoken";
import { refreshTokenDB } from "./refreshTokenDB";
import { Request, Response } from "express";

export default async function refresh(req: Request, res: Response) {
  const REFRESH_COOKIE_KEY = process.env.REFRESH_COOKIE_KEY as string;
  const refreshToken = req.cookies[REFRESH_COOKIE_KEY];

  if (!refreshToken) return res.status(401).send("Refresh Token이 없습니다.");
  refreshTokenDB.read();
  const tokenList = refreshTokenDB.data.refreshTokens;
  if (refreshToken in tokenList)
    return res.status(403).send("유효하지 않은 refresh token입니다.");

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET as string,
    (err: Error | null, payload: any) => {
      if (err)
        return res.status(403).send("유효하지 않은 refresh token입니다.");

      const newAccessToken = jwt.sign(
        { isAdmin: true } as AdminData,
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );
      res.json({ accessToken: newAccessToken });
    }
  );
}
