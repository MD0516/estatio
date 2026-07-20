import axios from "axios";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL
export const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error)
        const message =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

        const isSilent = error.config?.silent;

        if (!isSilent) {
            toast.error(message)
        }

        return Promise.reject(error)
    }
)