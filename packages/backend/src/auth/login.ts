import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AdminData } from "../type";
import { refreshTokenDB } from "./refreshTokenDB";

export default async function login(req: Request, res: Response) {
  const { password } = req.body;
  const hashedPassword = process.env.HASHED_PASSWORD as string;
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (isMatch) {
    // Access, Refresh Token 생성
    const accessToken = jwt.sign(
      { isAdmin: true } as AdminData,
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { isAdmin: true } as AdminData,
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    // Refrsh는 쿠키로, Access는 json으로 반환
    res.cookie(process.env.REFRESH_COOKIE_KEY as string, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });

    if (!refreshTokenDB.data) {
      await refreshTokenDB.read();
    }

    refreshTokenDB.data.refreshTokens.push(refreshToken);
    await refreshTokenDB.write();
  } else {
    res.status(401).json({ message: "비밀번호가 올바르지 않습니다" });
  }
}
