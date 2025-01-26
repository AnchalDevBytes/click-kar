"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TaskDialogProps {
  mode: "add" | "edit";
  task?: {
    id: string;
    title: string;
    priority: number;
    status: string;
    startTime: Date;
    endTime: Date;
  };
  onSubmit: (data: any) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  isSaving: boolean;
}

export function TaskDialog({
  mode,
  task,
  onSubmit,
  isDialogOpen,
  setIsDialogOpen,
  isSaving,
}: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    priority: task?.priority?.toString() || "3",
    status: task?.status || "pending",
    startTime: task?.startTime
      ? new Date(task.startTime).toISOString().slice(0, 16)
      : "",
    endTime: task?.endTime
      ? new Date(task.endTime).toISOString().slice(0, 16)
      : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      priority: parseInt(formData.priority),
      id: task?.id,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={mode === "add" ? "default" : "ghost"}
          size={mode === "add" ? "sm" : "icon"}
        >
          {mode === "add" ? "+ Add task" : "✏️"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add task" : "Edit task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Task title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((p) => (
                    <SelectItem key={p} value={p.toString()}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  checked={formData.status === "finished"}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      status: checked ? "finished" : "pending",
                    })
                  }
                />
                <span>
                  {formData.status === "finished" ? "Finished" : "Pending"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <Button type="submit">
              {isSaving ? "saving..." : mode === "add" ? "Add" : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
