import { Request, Response } from "express";
import { refreshTokenDB } from "./refreshTokenDB";

export default async function logout(req: Request, res: Response) {
  const REFRESH_COOKIE_KEY = process.env.REFRESH_COOKIE_KEY as string;
  const refreshToken = req.cookies[REFRESH_COOKIE_KEY];
  if (!refreshToken) {
    return res.status(204).send("이미 로그아웃된 상태입니다");
  }
  try {
    const tokenList = refreshTokenDB.data.refreshTokens;
    tokenList.filter((value) => value !== refreshToken);

    refreshTokenDB.data.refreshTokens = tokenList;
    await refreshTokenDB.write();

    // 사용자의 쿠키도 삭제
    res.clearCookie(REFRESH_COOKIE_KEY, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "로그아웃 되었습니다" });
  } catch (error) {
    console.error("로그아웃 처리 중 오류:", error);
    return res.status(500).json({
      message: "로그아웃 처리 중 오류가 발생했습니다. 다시 시도해주세요",
    });
  }
}
