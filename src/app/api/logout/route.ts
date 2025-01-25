import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json(
            { success: true, message: "Loggedout successfully!" },
            { status: 200 },
        );

        response.cookies.delete("token");
        return response;
    } catch (error) {
        if(error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Unknown error occurred" }
            );
        }
    }
}
