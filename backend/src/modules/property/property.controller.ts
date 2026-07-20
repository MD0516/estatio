import type { Request, Response } from "express";
import * as PropertyService from "./property.service.js";

export const uploadImages = async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return res.status(400).json({ message: "No images uploaded" })
    }

    const imageUrls = files.map((file) => `/uploads/properties/${file.filename}`)

    return res.status(200).json({
        message: "Images uploaded",
        images: imageUrls
    })
}

export const fetchAll = async (req: Request, res: Response) => {
    const data = await PropertyService.getAll();

    return res.status(200).json({
        message: "All properties fetched successfully",
        data
    })
}

export const fetchOne = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const propertyId = Number(id)
    if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    const data = await PropertyService.getOne(propertyId)

    return res.status(200).json({
        message: `Property fetched successfully`,
        data
    })
}

export const create = async (req: Request, res: Response) => {
    const user = req.user;
    await PropertyService.createProperty({ ...req.body, userId: user?.userId })

    return res.status(201).json({
        message: "Property created successfully"
    })
}

export const update = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const propertyId = Number(id)

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await PropertyService.updateProperty(propertyId, user?.userId, req.body)

    return res.status(200).json({
        message: "Property updated successfully"
    })
}

export const updateImages = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const propertyId = Number(id)

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await PropertyService.updateImages(propertyId, user.userId, req.body)

    return res.status(200).json({
        message: "Images updated successfully"
    })
}

export const deleteProperty = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const propertyId = Number(id)

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await PropertyService.deleteProperty(propertyId, user?.userId)

    return res.status(200).json({
        message: "Property deleted successfully"
    })
}

export const search = async (req: Request, res: Response) => {
    const result = await PropertyService.searchProperties(req.body)

    return res.status(200).json({
        message: "Properties fetched",
        ...result
    })
}

export const deletePropertyImage = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const user = req.user;
    const imageId = Number(id)

    if (isNaN(imageId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    await PropertyService.deletePropertyImage(imageId, user.userId);

    return res.status(200).json({
        message: "Property image deleted"
    })
}

export const fetchSimilarProperties = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const propertyId = Number(id)

    if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property id" });
    }

    const data = await PropertyService.getSimilarProperties(propertyId)

    return res.status(200).json({
        message: "Similar properties fetched",
        data
    })
}