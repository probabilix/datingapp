import rateLimit from 'express-rate-limit';

// General API Limiter: 300 requests per 15 minutes
// Industry Standard: Enough for normal usage, blocks abuse/scraping.
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too many requests, please try again later.'
    }
});

// Auth Limiter: 20 requests per hour
// Industry Standard: Strict protection against brute-force password guessing.
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        error: 'Too many login attempts, please try again later.'
    }
});
