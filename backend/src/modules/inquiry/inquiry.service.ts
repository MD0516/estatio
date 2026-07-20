import prisma from "../../lib/prisma.js";
import { CustomError } from "../../utils/error.js";
import type { CreateInquiryInput, UpdateInquiryStatusInput } from "./inquiry.schema.js";

export const createInquiry = async (
    userId: number,
    data: CreateInquiryInput
) => {
    const property = await prisma.property.findUnique({ where: { id: data.propertyId, isDeleted: false } });
    if (!property) {
        throw new CustomError(404, "Property not found");
    }

    if (property.userId === userId) {
        throw new CustomError(400, "You can't send Inquiry to your own property");
    }

    const existing = await prisma.inquiry.findUnique({
        where: {
            userId_propertyId: {
                userId, propertyId: data.propertyId
            }
        }
    })

    if (existing) {
        throw new CustomError(400, "Inquiry already sent")
    }

    await prisma.inquiry.create({
        data: {
            userId,
            propertyId: data.propertyId,
            message: data.message
        }
    })
}

export const updateStatus = async (
    userId: number,
    inquiryId: number,
    data: UpdateInquiryStatusInput
) => {
    const existing = await prisma.inquiry.findUnique({
        where: { id: inquiryId },
        select: {
            property: true
        }
    })

    if (!existing) {
        throw new CustomError(404, "Inquiry not found");
    }

    if (existing.property.userId !== userId) {
        throw new CustomError(403, "You are not authorized to edit this inquiry")
    }

    await prisma.inquiry.update({
        where: { id: inquiryId, property: { userId } },
        data: {
            status: data.status
        }
    })
}

export const getAllByUser = async (
    id: number
) => {
    const properties = await prisma.property.findMany({
        where: { userId: id },
        select: { id: true }
    });

    const propertyIds = properties.map((p) => p.id);

    if (propertyIds.length === 0) {
        return []
    }

    const inquiries = await prisma.inquiry.findMany({
        where: {
            propertyId: { in: propertyIds }
        },
        include: {
            property: {
                include: {
                    propertyImages: { where: { isCover: true } }
                }
            },
            user: {
                select: { id: true, name: true, email: true, phone: true }
            }
        }
    });

    return inquiries;
}