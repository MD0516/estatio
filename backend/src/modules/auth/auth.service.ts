import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../../lib/prisma.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";
import { CustomError } from "../../utils/error.js";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (data: RegisterInput) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        throw new CustomError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role: "seeker"
        }
    })

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1d"
    })

    return {
        token
    }
}

export const loginUser = async (data: LoginInput) => {
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user) {
        throw new CustomError(404, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
        throw new CustomError(404, "Invalid credentials");
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1d"
    })

    return {
        token
    }
}

export const getUser = async (data: { userId: number, role: string }) => {
    const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            properties: {
                where: { isDeleted: false },
                include: {
                    propertyDetails: true,
                    propertyImages: { where: { isCover: true } }
                }
            },
            wishlist: {
                include: {
                    property: {
                        include: {
                            propertyDetails: true,
                            propertyImages: { where: { isCover: true } }
                        }
                    }
                }
            },
            inquiries: {
                include: {
                    property: {
                        include: {
                            propertyDetails: true,
                            propertyImages: { where: { isCover: true } }
                        }
                    }
                }
            },
            reviews: true
        }
    });

    if (!user) {
        throw new CustomError(400, "Invalid user");
    }

    return { user };
}