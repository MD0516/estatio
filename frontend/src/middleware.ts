import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/profile", "/properties/new", "/properties/*/edit"]

const authRoutes = ["/login", "/register"]

function matchesRoute(pathname: string, patterns: string[]) {
    return patterns.some((pattern) => {
        const regex = new RegExp(
            "^" + pattern.replace(/\*/g, "[^/]+").replace(/\//g, "\\/") + "$"
        )
        return regex.test(pathname) || pathname === pattern;
    })
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("sessionCookie")?.value;
    const isAuthenticated = Boolean(token);

    const isProtected = matchesRoute(pathname, protectedRoutes);
    const isAuthRoute = matchesRoute(pathname, authRoutes);

    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname); // optional: come back after login
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/properties/new",
        "/properties/:id/edit",
        "/login",
        "/register",
    ],
};