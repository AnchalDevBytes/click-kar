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

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({
                success: false,
                message: "Invalid date format. Use 'YYYY-MM-DD'.",
            });
        }

        const updatedTask = await prisma.task.update({
            where: {
                id,
                userId,
            },
            data: {
                title,
                startTime : start,
                endTime : end,
                priority,
                status,
            },
        });
        if(!updatedTask) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            task: updatedTask,
        }, {
            status: 200
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
