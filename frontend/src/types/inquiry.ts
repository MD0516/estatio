import type { Property } from "./property";
import type { User } from "./user";

export type InquiryStatus =
    | "pending"
    | "responded"
    | "closed";

export type Inquiry = {
    id: number;
    userId: number;
    propertyId: number;

    message: string;
    status: InquiryStatus;

    createdAt: string;
    updatedAt: string;

    user?: User;
    property?: Property;
};

export type CreateInquiryInput = {
    propertyId: number;
    message: string;
};

export type UpdateInquiryStatusInput = {
    status: InquiryStatus;
};