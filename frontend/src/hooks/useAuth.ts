import { fetchProfileRequest, loginRequest, logoutRequest, registerRequest } from "@/lib/api/auth"
import { queryKeys } from "@/lib/queryKeys"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useProfile = () => {
    return useQuery({
        queryKey: queryKeys.auth.profile,
        queryFn: fetchProfileRequest,
        retry: false
    })
}

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: loginRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
            toast.success("Logged in successfully");
        },
    });
};

export const useRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registerRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
            toast.success("Account created successfully");
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutRequest,
        onSuccess: () => {
            queryClient.setQueryData(queryKeys.auth.profile, null);
            toast.success("Logged out successfully");
        },
    });
};