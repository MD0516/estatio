import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    createInquiryRequest,
    fetchInquiriesRequest,
    updateInquiryStatusRequest
} from "@/lib/api/inquiry";

import { queryKeys } from "@/lib/queryKeys";

import type {
    UpdateInquiryStatusInput
} from "@/types/inquiry";
import { toast } from "sonner";


// Queries

export const useInquiries = () => {
    return useQuery({
        queryKey: queryKeys.inquiry.all,
        queryFn: fetchInquiriesRequest
    });
};


// Mutations

export const useCreateInquiry = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createInquiryRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.inquiry.all
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.auth.profile
            });
            toast.success("Inquiry Sent")
        }
    });
};


export const useUpdateInquiryStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status
        }: {
            id: number;
            status: UpdateInquiryStatusInput["status"];
        }) =>
            updateInquiryStatusRequest(id, {
                status
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.inquiry.all
            });
            toast.success("Inquiry Status updated")
        }
    });
};