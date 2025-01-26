import { NextRequest, NextResponse } from "next/server";

export async function middleware(req : NextRequest) {
    const path = req.nextUrl.pathname;

    const isPublicPath = path === "/signup" || path === "/signin"; 

    const token = req.cookies.get("token")?.value;

    if(!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/signup", req.nextUrl));
    }

    if(token && isPublicPath) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

} 

export const config = {
    matcher: [
        "/signup",
        "/signin",
        "/"
    ]
}