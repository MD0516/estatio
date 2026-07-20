import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET as string;

interface DecodedToken {
    userId: number,
    role: string
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.sessionCookie;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

        req.user = decoded;
        next();
    } catch (err: any) {
        return res.status(401).json({ message: "Invalid or expired cookie" })
    }
}