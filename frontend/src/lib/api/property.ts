import { api } from "../axios";

import type {
    CreatePropertyInput,
    UpdatePropertyInput,
    UpdateImageInput,
    FilterInput
} from "@/types";

import type {
    Property,
    PropertyImage
} from "@/types/property";


export type UploadImagesResponse = {
    images: string[];
};

export type SearchPropertiesResponse = {
    message: string
    data: Property[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};


// Upload property images
export const uploadPropertyImagesRequest = async (
    files: File[]
): Promise<UploadImagesResponse> => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("images", file);
    });

    const res = await api.post<UploadImagesResponse>(
        "/property/upload-imgs",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return res.data;
};


// Create property
export const createPropertyRequest = async (
    data: CreatePropertyInput
): Promise<Property> => {
    const res = await api.post<Property>(
        "/property",
        data
    );

    return res.data;
};


// Update property
export const updatePropertyRequest = async (
    id: number,
    data: UpdatePropertyInput
): Promise<Property> => {
    const res = await api.patch<Property>(
        `/property/${id}`,
        data
    );

    return res.data;
};


// Update property images
export const updatePropertyImagesRequest = async (
    propertyId: number,
    data: UpdateImageInput
): Promise<PropertyImage[]> => {
    const res = await api.patch<PropertyImage[]>(
        `/property/image/${propertyId}`,
        data
    );

    return res.data;
};


// Delete individual property image
export const deletePropertyImageRequest = async (
    imageId: number
): Promise<void> => {
    await api.delete(
        `/property/image/${imageId}`
    );
};


// Soft-delete property
export const deletePropertyRequest = async (
    id: number
): Promise<void> => {
    await api.delete(
        `/property/${id}`
    );
};


// Get single property
export const fetchPropertyRequest = async (
    id: number
): Promise<Property> => {
    const res = await api.get<{ message: string, data: Property }>(
        `/property/${id}`
    );

    return res.data.data;
};


// Get all properties
export const fetchPropertiesRequest = async (): Promise<Property[]> => {
    const res = await api.get<{ message: string, data: Property[] }>(
        "/property"
    );

    return res.data.data;
};


// Search/filter properties
export const searchPropertiesRequest = async (
    filters: FilterInput
): Promise<SearchPropertiesResponse> => {
    const res = await api.post<SearchPropertiesResponse>(
        "/property/search",
        filters
    );

    return res.data;
};

export const fetchSimilarProperties = async (
    propertyId: number
): Promise<Property[]> => {
    const res = await api.get<{ message: string, data: Property[] }>(
        `/property/similar/${propertyId}`,
        {silent: true} as any
    )

    return res.data.data;
}