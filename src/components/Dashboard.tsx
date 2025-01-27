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
import { toast } from "@/hooks/use-toast";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

interface StatsResponse {
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
    prioritySummary: PrioritySummary[];
  };
}

interface PrioritySummary {
  priority: number;
  pendingTasks: number;
  timeLapsed: number;
  timeToFinish: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  // Fetch stats from API...

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await axios.get("/api/statistic");
        if(!response || !response.data.success) {
          toast({
            variant: "destructive",
            title: "Error",
            description: response.data?.message,
          });
          return;
        }

        setStats(response.data.data)
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response?.data?.message,
          });
          return;
        }
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong while fetching stats",
        });
      }
    }

    fetchStatsData();
  }, []);

  if (!stats) return <DashboardSkeleton/>;

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