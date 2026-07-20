import z from "zod";

export const createPropertySchema = z.object({
    title: z.string(),
    description: z.string(),
    city: z.string(),
    locality: z.string(),
    state: z.string(),
    address: z.string(),
    gMapUrl: z.string(),
    type: z.enum(["apartment", "villa", "house", "plot", "commercial"]),
    listingType: z.enum(["rent", "lease", "sale"]),
    price: z.number(),
    bedroom: z.number(),
    areaSqft: z.number(),
    floor: z.number().optional(),
    bathroom: z.number(),
    balcony: z.number(),
    furnishingStatus: z.enum(["full", "semi", "none"]),
    parking: z.enum(["car", "bike", "both", "none"]),
    facing: z.string(),
    images: z.array(z.object({
        url: z.string(),
        order: z.number(),
        isCover: z.boolean(),
    }))
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>

export const updatePropertySchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    city: z.string().optional(),
    locality: z.string().optional(),
    state: z.string().optional(),
    address: z.string().optional(),
    gMapUrl: z.string().optional(),
    type: z.enum(["apartment", "villa", "house", "plot", "commercial"]).optional(),
    listingType: z.enum(["rent", "lease", "sale"]).optional(),
    price: z.number().optional(),
    bedroom: z.number().optional(),
    status: z.enum(["active", "sold", "rented", "inactive"]).optional(),
    areaSqft: z.number().optional(),
    floor: z.number().optional().nullable(),
    bathroom: z.number().optional(),
    balcony: z.number().optional(),
    furnishingStatus: z.enum(["full", "semi", "none"]).optional(),
    parking: z.enum(["car", "bike", "both", "none"]).optional(),
    facing: z.string().optional(),
})

export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>

export const updateImageSchema = z.object({
    images: z.array(z.object({
        id: z.number().optional(),
        url: z.string(),
        order: z.number(),
        isCover: z.boolean(),
    }))
})

export type UpdateImageInput = z.infer<typeof updateImageSchema>

export const filterSchema = z.object({
    city: z.array(z.string()).optional(),
    type: z.array(z.string()).optional(),
    listingType: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bedroom: z.number().optional(),
    furnishingStatus: z.array(z.enum(["full", "semi", "none"])).optional(),
    parking: z.array(z.enum(["car", "bike", "both", "none"])).optional(),
    sortBy: z.enum(["price", "createdAt"]).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    page: z.number().default(1),
    limit: z.number().default(20)
})

export type FilterInput = z.infer<typeof filterSchema>