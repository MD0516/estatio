import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    addReviewRequest,
    fetchReviewsRequest,
    toggleHelpfulRequest
} from "@/lib/api/review";

import { queryKeys } from "@/lib/queryKeys";
import { toast } from "sonner";


// ------------------------------------
// Queries
// ------------------------------------

export const useReviews = (propertyId: number) => {
    return useQuery({
        queryKey: queryKeys.review.byProperty(propertyId),
        queryFn: () => fetchReviewsRequest(propertyId),
        enabled: !!propertyId
    });
};


// ------------------------------------
// Mutations
// ------------------------------------

export const useAddReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addReviewRequest,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.review.byProperty(
                    variables.propertyId
                )
            });
            toast.success("Review added")
        }
    });
};


export const useToggleHelpful = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            reviewId
        }: {
            reviewId: number;
            propertyId: number;
        }) => toggleHelpfulRequest(reviewId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.review.byProperty(
                    variables.propertyId
                )
            });
        }
    });
};