import z from "zod";

export const addReviewSchema = z.object({
    propertyId: z.number(),
    stars: z.number().min(1).max(5),
    note: z.string().optional()
})

export type AddReviewInput = z.infer<typeof addReviewSchema>