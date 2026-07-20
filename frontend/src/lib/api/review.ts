import type { AddReviewInput, Review } from "@/types/review";
import { api } from "../axios";


export const addReviewRequest = async (
    data: AddReviewInput
): Promise<Review> => {
    const res = await api.post<Review>(
        "/review",
        data
    );

    return res.data;
};


export const toggleHelpfulRequest = async (
    reviewId: number
): Promise<Review> => {
    const res = await api.post<Review>(
        `/review/${reviewId}/helpful`
    );

    return res.data;
};


export const fetchReviewsRequest = async (
    propertyId: number
): Promise<Review[]> => {
    const res = await api.get<{ message: string, data: Review[] }>(
        `/review/property/${propertyId}`, { silent: true } as any
    );

    return res.data.data;
};