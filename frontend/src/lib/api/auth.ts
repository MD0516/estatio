import { api } from "../axios"

export const loginRequest = async (data: { email: string, password: string }) => {
    const res = await api.post("/auth/login", data)

    return res.data
}

export const registerRequest = async (data: { name: string, email: string, password: string, phone: string }) => {
    const res = await api.post("/auth/register", data)

    return res.data
}

export const logoutRequest = async () => {
    const res = await api.post("/auth/logout")

    return res.data
}

export const fetchProfileRequest = async () => {
    const res = await api.get("/auth/profile", { silent: true } as any)

    return res.data
}