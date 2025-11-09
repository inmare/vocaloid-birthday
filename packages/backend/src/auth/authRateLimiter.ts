import rateLimit from "express-rate-limit";

// 로그인 접속 시도 제한
export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: "너무 많은 요청을 보냈습니다. 잠시 후 다시 시도해주세요.",
  standardHeaders: true,
  legacyHeaders: false,
});
