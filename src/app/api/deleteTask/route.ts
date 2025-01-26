import { prisma } from "@/server/prisma";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        // Retrieve token from cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Verify token and extract user ID
        const userId = verifyToken(token);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        // Parse JSON body
        const data = await req.json();

        // Validate the incoming data
        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json(
                { success: false, message: "No tasks selected for deletion" },
                { status: 400 }
            );
        }

        // Delete tasks with matching IDs
        const deletedTask = await prisma.task.deleteMany({
            where: {
                id: {
                    in: data, // Use 'in' to match an array of IDs
                },
                userId: userId, // Ensure only tasks belonging to the user are deleted
            },
        });

        if (!deletedTask.count) {
            return NextResponse.json(
                { success: false, message: "No tasks were deleted" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `${deletedTask.count} task(s) deleted successfully`,
        });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        } else {
            return NextResponse.json(
                { success: false, message: "Unknown error occurred" },
                { status: 500 }
            );
        }
    }
}
