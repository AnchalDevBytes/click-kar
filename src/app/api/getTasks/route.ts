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

export async function GET(req: NextRequest) {
    try {
        // Extract token from cookies
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access",
            }, { status: 401 });
        }

        // Verify token and extract userId
        const userId = verifyToken(token);
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Invalid token",
            }, { status: 401 });
        }

        // Parse search parameters for filters and sorting
        const { searchParams } = new URL(req.url);
        const priority = searchParams.get("priority");
        const status = searchParams.get("status");
        const sortBy = searchParams.get("sortBy");
        const sortOrder = searchParams.get("sortOrder") as "asc" | "desc";

        // Construct filters
        const filters: Filters = { userId };
        console.log("priorit-----", priority);
        
        if (priority) filters.priority = parseInt(priority, 10);
        if (status) filters.status = status;

        // Construct sorting options
        const orderBy: SortingOptions = {};
        if (sortBy === "startTime" || sortBy === "endTime") {
            orderBy[sortBy] = sortOrder;
        }
        // Fetch tasks from the database with filters and sorting
        const tasks = await prisma.task.findMany({
            where: filters,
            orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
        });

        if(!tasks || tasks.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No tasks found",
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message : "Tasks fetched successfully",
            tasks,
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
