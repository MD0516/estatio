import type { Request, Response } from "express"
import * as AuthService from "./auth.service.js"

export const register = async (req: Request, res: Response) => {
    const result = await AuthService.registerUser(req.body)

    res.cookie("sessionCookie", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
        message: "User registered Successfully",
    })

}

export const login = async (req: Request, res: Response) => {
    const result = await AuthService.loginUser(req.body)

    res.cookie("sessionCookie", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
        message: "Login success",
    })

}

export const profile = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const result = await AuthService.getUser(req.user);

    return res.status(200).json({
        message: "User details fetched",
        user: result.user,
    })
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("sessionCookie");
    return res.status(200).json({ message: "Logged out" })
}