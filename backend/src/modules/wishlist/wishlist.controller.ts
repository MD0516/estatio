import type { Request, Response } from "express";
import * as WishlistService from "./wishlist.service.js";

export const toggleWishlist = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const result = await WishlistService.toggleWishlist(req.body, user.userId)

    return res.status(200).json({ message: result.message, wishListed: result.wishListed })
}

export const fetchAll = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const data = await WishlistService.getAll(user.userId);

    return res.status(200).json({
        message: "All wishlists fetched for User",
        data
    })
}