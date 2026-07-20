import type { Property } from "./property";
import type { User } from "./user";

export type Wishlist = {
    id: number;
    userId: number;
    propertyId: number;

    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;

    user?: User;
    property?: Property;
};

export type AddWishListInput = {
    propertyId: number
}