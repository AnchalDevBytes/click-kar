import { prisma } from "@/server/prisma";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if(!token) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access",
            }, { status: 401 });
        }

        const userId = verifyToken(token);
        if (!userId) {
            return NextResponse.json({
              success: false,
              message: "Invalid token",
            }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Task ID is required" },
                { status: 400 }
            );
        }

        await prisma.task.delete({
            where: {
                id,
                userId,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Task deleted successfully",
        });
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
