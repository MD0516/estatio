"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { login } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        login.mutate({ email, password }, {
            onSuccess: () => router.push(searchParams.get("redirect") || "/"),
            onError: (err: any) => setError(err.response?.data?.message || "Login failed")
        })
    };

    return (
        <div className="login flex items-start justify-center px-4 my-5">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl border border-border-light shadow">
                <h1 className="text-2xl font-semibold text-text mb-6">Log in to Estatio</h1>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <div className="form-control mb-4">
                    <label className="block text-sm text-text-muted mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg px-3 py-2"
                    />
                </div>

                <div className="form-control mb-6">
                    <label className="block text-sm text-text-muted mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-lg px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={login.isPending}
                    className="w-full text-white font-medium btn btn-primary mt-2"
                >
                    {login.isPending ? "Logging in..." : "Log in"}
                </button>

                <p className="text-sm text-text-muted mt-4 text-center">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-primary font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}