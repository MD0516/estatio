import path from "path";
import fs from "fs/promises"
import prisma from "../../lib/prisma.js";
import { removeUndefined } from "../../utils/removeUndefined.js";
import type { CreatePropertyInput, FilterInput, UpdateImageInput, UpdatePropertyInput } from "./property.schema.js";
import { CustomError } from "../../utils/error.js";

export const createProperty = async (data: CreatePropertyInput & { userId: number }) => {
    return await prisma.$transaction(async (tx) => {
        const property = await tx.property.create({
            data: {
                userId: data.userId,
                title: data.title,
                description: data.description,
                city: data.city,
                locality: data.locality,
                state: data.state,
                address: data.address,
                gMapUrl: data.gMapUrl,
                type: data.type,
                listingType: data.listingType,
                price: data.price,
                bedroom: data.bedroom,
                status: "active",
                isDeleted: false
            }
        })

        const propertyDetails = await tx.propertyDetails.create({
            data: {
                propertyId: property.id,
                areaSqft: data.areaSqft,
                floor: data.floor ?? null,
                bedroom: data.bedroom,
                bathroom: data.bathroom,
                balcony: data.balcony,
                furnishingStatus: data.furnishingStatus,
                parking: data.parking,
                facing: data.facing,
            }
        })

        const propertyImages = await Promise.all(
            data.images.map((image) =>
                tx.propertyImage.create({
                    data: {
                        propertyId: property.id,
                        url: image.url,
                        order: image.order,
                        isCover: image.isCover
                    }
                })
            )
        )

        await tx.user.update({
            where: { id: data.userId },
            data: {
                role: "owner"
            }
        })

        return { property, propertyDetails, propertyImages }
    })
}

export const updateProperty = async (
    propertyId: number,
    userId: number,
    data: UpdatePropertyInput
) => {
    const existing = await prisma.property.findUnique({ where: { id: propertyId } })

    if (!existing) {
        throw new CustomError(404, "Property not found");
    }

    if (existing.userId !== userId) {
        throw new CustomError(403, "You are not authorized to edit this property")
    }

    return await prisma.$transaction(async (tx) => {
        const property = await tx.property.update({
            where: { id: propertyId },
            data: removeUndefined({
                title: data.title,
                description: data.description,
                city: data.city,
                locality: data.locality,
                state: data.state,
                address: data.address,
                gMapUrl: data.gMapUrl,
                type: data.type,
                listingType: data.listingType,
                price: data.price,
                bedroom: data.bedroom,
                status: data.status
            })
        })


        const propertyDetails = await tx.propertyDetails.update({
            where: { propertyId },
            data: removeUndefined({
                areaSqft: data.areaSqft,
                floor: data.floor,
                bedroom: data.bedroom,
                bathroom: data.bathroom,
                balcony: data.balcony,
                furnishingStatus: data.furnishingStatus,
                parking: data.parking,
                facing: data.facing,
            })
        })

        return { property, propertyDetails }
    })
}

export const updateImages = async (
    propertyId: number,
    userId: number,
    data: UpdateImageInput
) => {
    const existing = await prisma.property.findUnique({ where: { id: propertyId } })

    if (!existing) {
        throw new CustomError(404, "Property not found");
    }

    if (existing.userId !== userId) {
        throw new CustomError(403, "You are not authorized to edit this property")
    }
    console.log(data.images)
    return await prisma.$transaction(async (tx) => {
        for (const image of data.images) {
            if (image.id) {
                const exists = await tx.propertyImage.findFirst({
                    where: {
                        id: image.id,
                        propertyId
                    }
                })

                if (!exists) {
                    throw new CustomError(404, "Image not found")
                }

                await tx.propertyImage.update({
                    where: { id: image.id },
                    data: {
                        url: image.url,
                        order: image.order,
                        isCover: image.isCover
                    }
                })
            }

            if (!image.id) {
                await tx.propertyImage.create({
                    data: {
                        propertyId,
                        url: image.url,
                        order: image.order,
                        isCover: image.isCover
                    }
                })
            }
        }
    })
}

export const deletePropertyImage = async (
    id: number,
    userId: number
) => {
    const img = await prisma.propertyImage.findUnique({
        where: { id },
        include: { property: true }
    })

    if (!img) {
        throw new CustomError(404, "Image not found")
    }

    if (img.property.userId !== userId) {
        throw new CustomError(403, "You are not authorized to delete this image")
    }

    await prisma.propertyImage.delete({
        where: { id }
    })
    const filePath = path.join(process.cwd(), img.url);

    try {
        fs.unlink(filePath)
    } catch (err) {
        console.error(`Failed to delete file: ${filePath}`);
    }
}

export const deleteProperty = async (
    propertyId: number,
    userId: number
) => {
    const existing = await prisma.property.findUnique({ where: { id: propertyId } })

    if (!existing) {
        throw new CustomError(404, "Property not found");
    }

    if (existing.userId !== userId) {
        throw new CustomError(403, "You are not authorized to delete this property")
    }

    await prisma.property.update({
        where: { id: propertyId },
        data: {
            isDeleted: true
        }
    })

}

export const getAll = async () => {
    const properties = await prisma.property.findMany({
        where: { isDeleted: false },
        include: {
            propertyDetails: true,
            propertyImages: {
                where: { isCover: true }
            },
            wishlist: true,
            inquiries: true
        }
    });

    return properties;
}

export const getOne = async (
    id: number
) => {
    const property = await prisma.property.findUnique({
        where: { id, isDeleted: false },
        include: {
            propertyDetails: true,
            propertyImages: true,
            wishlist: true,
            inquiries: true
        }
    })

    if (!property) {
        throw new CustomError(404, "Property not found")
    }

    return property;
}

export const searchProperties = async (
    filters: FilterInput
) => {
    const where: any = { isDeleted: false, status: "active" }

    if (filters.city && filters.city.length > 0) {
        where.city = { in: filters.city, mode: "insensitive" }
    }

    if (filters.type && filters.type.length > 0) {
        where.type = { in: filters.type }
    }

    if (filters.minPrice || filters.maxPrice) {
        where.price = {}
        if (filters.minPrice) where.price.gte = filters.minPrice
        if (filters.maxPrice) where.price.lte = filters.maxPrice
    }

    if (filters.listingType) where.listingType = filters.listingType

    if (filters.bedroom) where.bedroom = filters.bedroom

    if (filters.furnishingStatus || filters.parking) {
        where.propertyDetails = {}
        if (filters.furnishingStatus) where.propertyDetails.furnishingStatus = { in: filters.furnishingStatus }
        if (filters.parking) where.propertyDetails.parking = { in: filters.parking }
    }

    const skip = (filters.page - 1) * filters.limit;

    const [properties, total] = await Promise.all([
        prisma.property.findMany({
            where,
            orderBy: { [filters.sortBy]: filters.sortOrder },
            skip,
            take: filters.limit,
            include: {
                propertyDetails: true,
                propertyImages: {
                    where: { isCover: true },
                    take: 1
                },
                wishlist: true
            }
        }),
        prisma.property.count({ where })
    ])

    return {
        data: properties,
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit)
    }
}

export const getSimilarProperties = async (
    propertyId: number
) => {
    const property = await prisma.property.findFirst({
        where: { id: propertyId }
    })

    if (!property) {
        throw new CustomError(404, "Property not found")
    }

    const priceMin = property.price * 0.7;
    const priceMax = property.price * 1.3;

    const similar = await prisma.property.findMany({
        where: {
            id: { not: propertyId },
            isDeleted: false,
            status: "active",
            city: property.city,
            type: property.type,
            price: { gte: priceMin, lte: priceMax }
        },
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
            propertyDetails: true,
            propertyImages: {
                where: { isCover: true }
            }
        }
    })

    return similar
}