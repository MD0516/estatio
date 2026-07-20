import { Inquiry } from "./inquiry";
import { Property } from "./property";
import { Review } from "./review";
import { Wishlist } from "./wishlist";

export type Role = "seeker" | "owner";

export type User = {
    id: number;
    name: string;
    email: string;
    phone: string;
    emailVerified: boolean;
    role: Role;
    createdAt: string;
    updatedAt: string;

    properties: Property[];
    wishlist: Wishlist[];
    inquiries: Inquiry[];
    reviews: Review[]
};