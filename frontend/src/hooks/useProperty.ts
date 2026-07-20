import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    createPropertyRequest,
    deletePropertyImageRequest,
    deletePropertyRequest,
    fetchPropertiesRequest,
    fetchPropertyRequest,
    fetchSimilarProperties,
    searchPropertiesRequest,
    updatePropertyImagesRequest,
    updatePropertyRequest,
    uploadPropertyImagesRequest
} from "@/lib/api/property";

import { queryKeys } from "@/lib/queryKeys";

import type {
    FilterInput,
    Property,
    UpdateImageInput,
    UpdatePropertyInput
} from "@/types";
import { toast } from "sonner";


// ------------------------------------
// Queries
// ------------------------------------

export const useProperties = () => {
    return useQuery({
        queryKey: queryKeys.property.all,
        queryFn: fetchPropertiesRequest
    });
};


export const useProperty = (id: number, options?: { initialData?: Property }) => {
    return useQuery({
        queryKey: queryKeys.property.detail(id),
        queryFn: () => fetchPropertyRequest(id),
        initialData: options?.initialData
    });
};


export const useSearchProperties = (
    filters: FilterInput
) => {
    return useQuery({
        queryKey: queryKeys.property.search(filters),
        queryFn: () => searchPropertiesRequest(filters)
    });
};


export const useSimilarProperties = (
    id: number
) => {
    return useQuery({
        queryKey: queryKeys.property.similar(id),
        queryFn: () => fetchSimilarProperties(id),
        enabled: !!id
    })
}


// ------------------------------------
// Mutations
// ------------------------------------

export const useUploadPropertyImages = () => {
    return useMutation({
        mutationFn: uploadPropertyImagesRequest
    });
};


export const useCreateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createPropertyRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.property.all
            });
            toast.success("Property Listed Successfully")
        }
    });
};


export const useUpdateProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            data
        }: {
            id: number;
            data: UpdatePropertyInput;
        }) => updatePropertyRequest(id, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.property.detail(
                    variables.id
                )
            });

            queryClient.invalidateQueries({
                queryKey: queryKeys.property.all
            });
            toast.success("Property Updated Successfully")
        }
    });
};


export const useUpdatePropertyImages = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            propertyId,
            data
        }: {
            propertyId: number;
            data: UpdateImageInput;
        }) =>
            updatePropertyImagesRequest(
                propertyId,
                data
            ),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.property.detail(
                    variables.propertyId
                )
            });
        }
    });
};


export const useDeletePropertyImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            imageId
        }: {
            imageId: number;
            propertyId: number;
        }) =>
            deletePropertyImageRequest(imageId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.property.detail(
                    variables.propertyId
                )
            });
            toast.success("Image Deleted")
        }
    });
};


export const useDeleteProperty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePropertyRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.property.all
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.auth.profile
            });
            toast.success("Property Deleted")
        }
    });
};