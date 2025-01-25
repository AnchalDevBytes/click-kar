import { prisma } from "@/server/prisma";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
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

        const { id, title, startTime, endTime, priority, status } = await req.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Task ID is required" },
                { status: 400 }
            );
        }

        const updatedTask = await prisma.task.update({
            where: {
                id,
                userId,
            },
            data: {
                title,
                startTime,
                endTime,
                priority,
                status,
            },
        });

        return NextResponse.json({
            success: true,
            task: updatedTask,
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
