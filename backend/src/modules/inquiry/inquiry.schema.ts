import z from "zod";

export const createInquirySchema = z.object({
    propertyId: z.number(),
    message: z.string().min(1, "Message cannot be empty"),
})

export type CreateInquiryInput = z.infer<typeof createInquirySchema>

export const updateInquiryStatusSchema = z.object({
    status: z.enum(["pending", "responded", "closed"])
})

export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>