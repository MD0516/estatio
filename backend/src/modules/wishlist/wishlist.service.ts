import prisma from "../../lib/prisma.js";
import { CustomError } from "../../utils/error.js";
import type { AddWishlistInput } from "./wishlist.schema.js";

export const toggleWishlist = async (
    data: AddWishlistInput,
    userId: number
) => {
    const property = await prisma.property.findUnique({ where: { id: data.propertyId, isDeleted: false } });
    if (!property) {
        throw new CustomError(404, "Property not found");
    }

    if(property.userId === userId) {
        throw new CustomError(400, "You can't add your listing to wishlist")
    }

    const existing = await prisma.wishlist.findFirst({
        where: {
            userId,
            propertyId: data.propertyId,
        }
    })

    if (existing) {
        await prisma.wishlist.delete({
            where: { id: existing.id }
        })

        return { message: "Wishlist removed", wishListed: false }
    }

    await prisma.wishlist.create({
        data: {
            userId,
            propertyId: data.propertyId
        }
    })
    return { message: "Wishlist added", wishListed: true  }
}

export const getAll = async (
    userId: number
) => {
    const wishlists = await prisma.wishlist.findMany({
        where: { userId }
    })

    return wishlists
}