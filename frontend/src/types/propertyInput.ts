import type {
    FurnishingStatus,
    ListingType,
    Parking,
    PropertyImage,
    PropertyStatus,
    PropertyType
} from "./property";


export type CreatePropertyImageInput = {
    url: string;
    order: number;
    isCover: boolean;
};


export type CreatePropertyInput = {
    title: string;
    description: string;

    city: string;
    locality: string;
    state: string;
    address: string;
    gMapUrl: string;

    type: PropertyType;
    listingType: ListingType;

    price: number;
    bedroom: number;

    areaSqft: number;
    floor?: number;
    bathroom: number;
    balcony: number;

    furnishingStatus: FurnishingStatus;
    parking: Parking;
    facing: string;

    images: CreatePropertyImageInput[];
};


export type UpdatePropertyInput = {
    title?: string;
    description?: string;

    city?: string;
    locality?: string;
    state?: string;
    address?: string;
    gMapUrl?: string;

    type?: PropertyType;
    listingType?: ListingType;

    price?: number;
    bedroom?: number;
    status?: PropertyStatus;

    areaSqft?: number;
    floor?: number | null;
    bathroom?: number;
    balcony?: number;

    furnishingStatus?: FurnishingStatus;
    parking?: Parking;
    facing?: string;
};
    

export type UpdateImageInput = {
    images?: PropertyImage[];
};


export type FilterInput = {
    city?: string[];
    type?: string[];
    listingType?: string;

    minPrice?: number;
    maxPrice?: number;
    bedroom?: number;

    furnishingStatus?: FurnishingStatus[];
    parking?: Parking[];

    sortBy?: "price" | "createdAt";
    sortOrder?: "asc" | "desc";

    page?: number;
    limit?: number;
};