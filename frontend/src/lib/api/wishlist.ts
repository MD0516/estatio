import { AddWishListInput, Wishlist } from "@/types";
import { api } from "../axios";

// Toggle Property WishList
export const addWishlistRequest = async (
    data: AddWishListInput
) => {
    const res = await api.post(
        "/wishlist",
        data
    )
    
    return res.data
}

// Get all user's wishlists
export const fetchWishlistRequest = async (): Promise<Wishlist[]> => {
    const res = await api.get(
        "/wishlist", { silent: true } as any
    )
    return res.data
}