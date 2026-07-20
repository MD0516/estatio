import type { Request, Response } from "express";
import * as ReviewService from "./review.service.js"

export const create = async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await ReviewService.addReview(user.userId, req.body)

    return res.status(201).json({
        message: "Review posted",
    })
}

export const fetch = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const propertyId = Number(id)

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    const data = await ReviewService.fetchByProperty(propertyId);

    return res.status(200).json({
        message: "Review fetched successfully",
        data
    })
}

export const helpful = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params
    const user = req.user;
    const reviewId = Number(id)

    if (isNaN(reviewId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const result = await ReviewService.markHelpful(user.userId, reviewId)

    return res.status(200).json({
        message: result.message
    })
}