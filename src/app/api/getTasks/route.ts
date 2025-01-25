import { prisma } from "@/server/prisma";
import { verifyToken } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";

type Filters = {
    userId: string;
    priority?: number;
    status?: string;
};

type SortingOptions = {
    startTime?: "asc" | "desc";
    endTime?: "asc" | "desc";
};

export async function GET(req : NextRequest) {
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
        const priority = searchParams.get("priority");
        const status = searchParams.get("status");
        const sortBy = searchParams.get("sortBy");
        const sortOrder = (searchParams.get("sortOrder") === "desc" ? "desc" : "asc") as "asc" | "desc";
        
        const filters: Filters = { userId };
        if (priority) {
            filters.priority = parseInt(priority, 5);
        }
        if (status) {
            filters.status = status;
        }

        const orderBy: SortingOptions = {};
        if (sortBy === "startTime" || sortBy === "endTime") {
            orderBy[sortBy] = sortOrder;
        }

        const tasks = await prisma.task.findMany({
            where: filters,
            orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        });

        return NextResponse.json({
            success: true,
            tasks,
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
