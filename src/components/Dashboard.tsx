"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface DashboardStats {
  summary: {
    totalTasks: number;
    tasksCompletedPercentage: number;
    tasksPendingPercentage: number;
    avgTimePerCompletedTask: number;
  };
  pendingTaskSummary: {
    totalPendingTasks: number;
    totalTimeLapsed: number;
    estimatedTimeToFinish: number;
    prioritySummary: {
      priority: number;
      pendingTasks: number;
      timeLapsed: number;
      timeToFinish: number;
    }[];
  };
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  // Fetch stats from API...

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.summary.totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.summary.tasksCompletedPercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tasks pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.summary.tasksPendingPercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average time per completed task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.summary.avgTimePerCompletedTask.toFixed(1)} hrs
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Pending task summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingTaskSummary.totalPendingTasks}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total time lapsed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingTaskSummary.totalTimeLapsed} hrs
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total time to finish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.pendingTaskSummary.estimatedTimeToFinish} hrs
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Priority Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task priority</TableHead>
                  <TableHead>Pending tasks</TableHead>
                  <TableHead>Time lapsed (hrs)</TableHead>
                  <TableHead>Time to finish (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.pendingTaskSummary.prioritySummary.map((summary) => (
                  <TableRow key={summary.priority}>
                    <TableCell>{summary.priority}</TableCell>
                    <TableCell>{summary.pendingTasks}</TableCell>
                    <TableCell>{summary.timeLapsed}</TableCell>
                    <TableCell>{summary.timeToFinish}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}