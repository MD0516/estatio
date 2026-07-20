import z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters").regex(passwordRegex, "Password must include uppercase, lowercase, number, and special character"),
    phone: z.string().min(10)
})

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>;