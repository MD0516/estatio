import z from "zod";

export const addWishlistSchema = z.object({
    propertyId: z.number()
})

export type AddWishlistInput = z.infer<typeof addWishlistSchema>