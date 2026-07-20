"use client"
import { useLogin, useLogout, useProfile, useRegister } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperty";
import { User } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AppContextType = {
    user: User,
    isLoading: boolean,
    login: ReturnType<typeof useLogin>,
    register: ReturnType<typeof useRegister>,
    logout: ReturnType<typeof useLogout>,
    isMobile: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { data, isLoading } = useProfile();
    const [isMobile, setIsMobile] = useState(false)
    const login = useLogin();
    const register = useRegister();
    const logout = useLogout();
    useEffect(() => {
        const check = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        check()

        window.addEventListener("resize", check)

        return () => window.removeEventListener("resize", check)
    }, [])

    const states = {
        user: data?.user ?? null,
        isLoading,
        login,
        register,
        logout,
        isMobile
    }

    return <AppContext.Provider value={states}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    const context = useContext(AppContext)

    if (context === undefined) {
        throw new Error("useAppContext must be with in AppContext")
    }

    return context
}