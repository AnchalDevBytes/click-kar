import { prisma } from "@/server/prisma";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
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

        const { title, startTime, endTime, priority, status } = await req.json();

        if (!title || !startTime || !endTime || !priority || !status) {
            return NextResponse.json({
              success: false,
              message: "All fields are required",
            });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return NextResponse.json({
                success: false,
                message: "Invalid date format. Use 'YYYY-MM-DD'.",
            });
        }

        const task = await prisma.task.create({
            data : {
                title,
                startTime : new Date(start),
                endTime : new Date(end),
                priority,
                status,
                userId
            },
            select : {
                id : true,
                title : true,
                startTime : true,
                endTime : true,
                priority : true,
                status : true,
                userId : true,
                createdAt : true,
                updatedAt : true
            }
        });

        if(!task) {
            return NextResponse.json({
                success : false,
                message : "Error while creating task!"
            });
        }
      
        return NextResponse.json({
            success: true,
            message: "Task created successfully",
            task,
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
