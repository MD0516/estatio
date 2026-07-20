"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const { register } = useAppContext();
    const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
    const [error, setError] = useState("");
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        register.mutate(form, {
            onSuccess: () => router.push("/"),
            onError: (err: any) => setError(err.response?.data?.message || "Registration failed")
        })
    };

    return (
        <div className="register flex items-start justify-center px-4 mt-5">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl border border-border-light shadow">
                <h1 className="text-2xl font-semibold text-text mb-6">Create your account</h1>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                {[
                    { label: "Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Phone", name: "phone", type: "text" },
                    { label: "Password", name: "password", type: "password" },
                ].map((field) => (
                    <div className="form-control mb-4" key={field.name}>
                        <label className="block text-sm text-text-muted mb-1">{field.label}</label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={(form as any)[field.name]}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg px-3 py-2"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={register.isPending}
                    className="w-full text-white font-medium btn btn-primary mt-2"
                >
                    {register.isPending ? "Creating account..." : "Sign up"}
                </button>

                <p className="text-sm text-text-muted mt-4 text-center">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-medium">
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}