import { prisma } from "@/server/prisma";
import { verifyToken } from "@/utils/auth";
import { 
    calculateAvgTimePerCompletedTask,
    calculatePendingTaskSummary, 
    calculatePrioritySummary, 
    calculateTaskSummary 
} from "@/utils/statistic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

        const tasks = await prisma.task.findMany({
            where: { userId },
        });

        const { totalTasks, completedTasks, pendingTasks } = calculateTaskSummary(tasks);
        const avgTimePerCompletedTask = calculateAvgTimePerCompletedTask(tasks, completedTasks);

        const pendingTaskSummary = tasks.filter((task) => task.status === "pending");
        const { totalPendingTasks, totalTimeLapsed, estimatedTimeToFinish } = calculatePendingTaskSummary(pendingTaskSummary);
        const prioritySummary = calculatePrioritySummary(pendingTaskSummary);
        
        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalTasks,
                    tasksCompletedPercentage: completedTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
                    tasksPendingPercentage: pendingTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0,
                    avgTimePerCompletedTask,
                },
                pendingTaskSummary: {
                    totalPendingTasks,
                    totalTimeLapsed,
                    estimatedTimeToFinish,
                    prioritySummary,
                },
            },
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
