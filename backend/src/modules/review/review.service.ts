import prisma from "../../lib/prisma.js";
import { CustomError } from "../../utils/error.js";
import type { AddReviewInput } from "./review.schema.js";

export const addReview = async (
    userId: number,
    data: AddReviewInput
) => {
    const existing = await prisma.review.findUnique({
        where: {
            userId_propertyId: {
                userId, propertyId: data.propertyId
            }
        }
    })

    if (existing) {
        throw new CustomError(400, "Already review exists")
    }

    await prisma.review.create({
        data: {
            userId,
            propertyId: data.propertyId,
            stars: data.stars,
            note: data.note ?? null
        }
    })
}

export const fetchByProperty = async (
    propertyId: number
) => {
    const property = await prisma.property.findUnique({ where: { id: propertyId, isDeleted: false } });
    if (!property) {
        throw new CustomError(404, "Property not found");
    }

    const reviews = await prisma.review.findMany({
        where: { propertyId },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    phone: true,
                }
            }
        }
    })

    return reviews
}

export const markHelpful = async (
    userId: number,
    reviewId: number
) => {
    const existing = await prisma.review.findFirst({
        where: { id: reviewId }
    })

    if (!existing) {
        throw new CustomError(404, "Review not found")
    }

    if (existing.userId === userId) {
        throw new CustomError(400, "You cannot mark your own review as helpful")
    }

    const alreadyHelpful = existing.helpful.includes(userId)

    const updates = alreadyHelpful
        ? existing.helpful.filter(id => id !== userId)
        : [...existing.helpful, userId]

    const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
            helpful: updates
        }
    })

    return {
        message: alreadyHelpful ? "Removed helpful vote" : "Marked as helpful",
        helpfulCount: review.helpful.length,
    }
}