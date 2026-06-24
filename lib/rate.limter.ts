import { rateLimit } from "express-rate-limit";

const setLimiter = (max: number, windowMs: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 429,
      error: "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const authLimiter = setLimiter(5, 15 * 60 * 1000);
export const generalLimiter = setLimiter(100, 60 * 60 * 1000);
