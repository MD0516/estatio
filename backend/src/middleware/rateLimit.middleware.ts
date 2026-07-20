import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const inquiryRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    keyGenerator: (req) => {
        if (req.user?.userId) {
            return `user:${req.user.userId}`;
        }

        return ipKeyGenerator(req.ip ?? "unknown");
    },
    message: { message: "Too many inquiries sent. Please try again later." }
})