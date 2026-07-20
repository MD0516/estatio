import { addWishlistRequest, fetchWishlistRequest } from "@/lib/api/wishlist"
import { queryKeys } from "@/lib/queryKeys"
import { AddWishListInput } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


// ------------------------------------
// Queries
// ------------------------------------

export const useWishlists = () => {
    return useQuery({
        queryKey: queryKeys.wishlist.all,
        queryFn: fetchWishlistRequest
    })
}

// ------------------------------------
// Mutations
// ------------------------------------

export const useAddWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: AddWishListInput) => addWishlistRequest(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.property.all,
            })
            queryClient.invalidateQueries({
                queryKey: queryKeys.wishlist.all,
            })
            queryClient.invalidateQueries({
                queryKey: queryKeys.auth.profile,
            })
            
            toast.success(data?.wishListed ? "Wishlist added" : "Wishlist Removed")
        }
    })
}