import type { Property } from "./property";
import type { User } from "./user";

export type Review = {
    id: number;
    userId: number;
    propertyId: number;

    stars: number;
    note: string | null;
    helpful: number[];

    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;

    user?: User;
    property?: Property;
};

export type AddReviewInput = {
    propertyId: number;
    stars: number;
    note?: string;
};