"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskDialog } from "@/components/TaskDialog";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  priority: number;
  status: string;
  startTime: Date;
  endTime: Date;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [priorityFilter, setPriorityFilter] = useState<number>(1);
  const [sortByFilter, setSortByFilter] = useState<string>("startTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateTimeToFinish = (startTime: Date, endTime: Date) => {
    const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
    return (diff / (1000 * 60 * 60)).toFixed(2);
  };

  const handleAddTask = async (task: Task) => {
    try {
      setIsSaving(true);
      const response = await axios.post("/api/createTask", task);
      if (!response || !response.data || !response.data.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data?.message,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Task created successfully!",
      });
      setIsDialogOpen(false);
      setTasks([...tasks, response.data.task]);
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
        description: "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTask = async (task: Task) => {
    try {
      setIsSaving(true);
      const response = await axios.put("/api/updateTask", task);
      if (!response || !response.data || !response.data.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data?.message,
        });
        return;
      }

      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
      setIsDialogOpen(false);
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          return [
            ...prev.slice(0, index),
            { ...prev[index], ...task },
            ...prev.slice(index + 1),
          ];
        }
        return prev;
      });
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
        description: "Something went wrong",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getAllTasks = async (data: {
    priority: number | null;
    status: string | null;
    sortBy: string;
    sortOrder: string;
  }) => {
    const { priority, status, sortBy, sortOrder } = data;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/getTasks?priority=${priority}&status=${status}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!response || !response.data || !response.data.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data?.message,
        });
        return;
      }
      setTasks(response.data.tasks);
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
        description: "Something went wrong while fetching task list",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (key: string) => {
    if (sortByFilter === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortByFilter(key);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    getAllTasks({
      priority: priorityFilter,
      status: statusFilter,
      sortBy: sortByFilter,
      sortOrder,
    });
  }, [priorityFilter, statusFilter, sortByFilter, sortOrder]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <TaskDialog
            isSaving={isSaving}
            setIsDialogOpen={setIsDialogOpen}
            isDialogOpen={isDialogOpen}
            mode="add"
            onSubmit={handleAddTask}
          />

          <Button
            variant="destructive"
            size="sm"
            disabled={selectedTasks.length === 0}
            onClick={() => {}}
          >
            Delete selected
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                ⇅ Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => handleSortChange("startTime")}
              >
                Start time:{" "}
                {sortByFilter === "startTime" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("endTime")}
              >
                End time:{" "}
                {sortByFilter === "endTime" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Priority ▾
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[1, 2, 3, 4, 5].map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                >
                  {p}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => setPriorityFilter(1)}>
                Remove filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Status ▾
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("finished")}>
                Finished
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Remove filter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedTasks.length === tasks.length}
                onCheckedChange={(checked) => {
                  setSelectedTasks(checked ? tasks.map((t) => t.id) : []);
                }}
              />
            </TableHead>
            <TableHead>Task ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Time</TableHead>
            <TableHead>End Time</TableHead>
            <TableHead>Total time to finish (hrs)</TableHead>
            <TableHead className="w-12">Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <Checkbox
                  checked={selectedTasks.includes(task.id)}
                  onCheckedChange={(checked) => {
                    setSelectedTasks(
                      checked
                        ? [...selectedTasks, task.id]
                        : selectedTasks.filter((id) => id !== task.id)
                    );
                  }}
                />
              </TableCell>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.priority}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{new Date(task.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(task.endTime).toLocaleString()}</TableCell>
              <TableCell>
                {calculateTimeToFinish(task.startTime, task.endTime)}
              </TableCell>
              <TableCell>
                <TaskDialog
                  isSaving={isSaving}
                  isDialogOpen={isDialogOpen}
                  setIsDialogOpen={setIsDialogOpen}
                  mode="edit"
                  task={task}
                  onSubmit={handleUpdateTask}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}