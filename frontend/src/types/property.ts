import { Inquiry } from './inquiry';
import { Review } from './review';
import { Wishlist } from './wishlist';

export type PropertyType =
    | "apartment"
    | "villa"
    | "house"
    | "plot"
    | "commercial";

export type ListingType =
    | "rent"
    | "lease"
    | "sale";

export type PropertyStatus =
    | "active"
    | "sold"
    | "rented"
    | "inactive";

export type FurnishingStatus =
    | "full"
    | "semi"
    | "none";

export type Parking =
    | "car"
    | "bike"
    | "both"
    | "none";


export type PropertyDetails = {
    id: number;
    propertyId: number;

    areaSqft: number;
    floor: number | null;
    bedroom: number;
    bathroom: number;
    balcony: number;
    furnishingStatus: FurnishingStatus;
    parking: Parking;
    facing: string | null;

    createdAt: string;
    updatedAt: string;
};


export type PropertyImage = {
    id?: number;
    propertyId?: number;

    url: string;
    order: number;
    isCover: boolean;

    createdAt?: string;
    updatedAt?: string;
};


export type Property = {
    id: number;
    userId: number;

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

    status: PropertyStatus;
    isDeleted: boolean;

    createdAt: string;
    updatedAt: string;

    propertyDetails?: PropertyDetails | null;
    propertyImages?: PropertyImage[];
    wishlist?: Wishlist[]
    inquiries?: Inquiry[]
    reviews?: Review[]
};

export type PropertyFormState = {
    title: string;
    description: string;

    type: PropertyType | "";
    listingType: ListingType | "";
    price: string;
    bedroom: string;

    status: PropertyStatus;

    areaSqft: string;
    floor: string;
    bathroom: string;
    balcony: string;

    furnishingStatus: FurnishingStatus;
    parking: Parking;
    facing: string;

    address: string;
    locality: string;
    city: string;
    state: string;
    gMapUrl: string;
};