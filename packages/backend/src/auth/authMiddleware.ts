import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).send({ message: "토큰이 없습니다." });
  }

  jwt.verify(
    token as string,
    process.env.JWT_SECRET as string,
    (err, payload) => {
      if (err) {
        return res.status(403).send({ message: "유효하지 않은 토큰입니다." });
      }

      if (typeof payload !== "object" || !payload.isAdmin) {
        return res.status(403).send({ message: "관리자 권한이 없습니다." });
      }

      next();
    }
  );
}
