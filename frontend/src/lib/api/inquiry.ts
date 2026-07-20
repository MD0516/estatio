import { api } from "../axios";

import type {
    CreateInquiryInput,
    Inquiry,
    UpdateInquiryStatusInput
} from "@/types/inquiry";


export const createInquiryRequest = async (
    data: CreateInquiryInput
): Promise<Inquiry> => {
    const res = await api.post<Inquiry>(
        "/inquiry",
        data
    );

    return res.data;
};


export const updateInquiryStatusRequest = async (
    id: number,
    data: UpdateInquiryStatusInput
): Promise<Inquiry> => {
    const res = await api.patch<Inquiry>(
        `/inquiry/${id}`,
        data
    );

    return res.data;
};


export const fetchInquiriesRequest = async (): Promise<Inquiry[]> => {
    const res = await api.get<{ message: string, data: Inquiry[] }>(
        "/inquiry"
    );

    return res.data.data;
};