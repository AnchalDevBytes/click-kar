// function to calculate total and completed tasks
export const calculateTaskSummary = (tasks: any[]) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;

    return { totalTasks, completedTasks, pendingTasks };
};

// function to calculate average time for completed tasks
export const calculateAvgTimePerCompletedTask = (tasks: any[], completedTasks: number) => {
    const totalCompletedTime = tasks
        .filter((task) => task.status === "completed" && task.startTime && task.endTime)
        .reduce((sum, task) => {
            const timeTaken = (new Date(task.endTime).getTime() - new Date(task.startTime).getTime()) / 3600000;
            return sum + timeTaken;
        }, 0);
    return completedTasks > 0 ? totalCompletedTime / completedTasks : 0;
};

// function to calculate pending task time lapsed and time to finish
export const calculatePendingTaskSummary = (pendingTaskSummary: any[]) => {
    const totalPendingTasks = pendingTaskSummary.length;

    const totalTimeLapsed = pendingTaskSummary.reduce((sum, task) => {
        const timeLapsed = (new Date().getTime() - new Date(task.startTime).getTime()) / 3600000;
        return sum + timeLapsed;
    }, 0);

    const estimatedTimeToFinish = pendingTaskSummary.reduce((sum, task) => {
        if (task.endTime) {
            const timeToFinish = (new Date(task.endTime).getTime() - new Date().getTime()) / 3600000;
            return sum + (timeToFinish > 0 ? timeToFinish : 0);
        }
        return sum;
    }, 0);

    return { totalPendingTasks, totalTimeLapsed, estimatedTimeToFinish };
};

// function to calculate priority task summary
export const calculatePrioritySummary = (pendingTaskSummary: any[]) => {
    return [1, 2, 3, 4, 5].map((priority) => {
        const tasksByPriority = pendingTaskSummary.filter((task) => task.priority === priority);
        const tasksCount = tasksByPriority.length;

        const timeLapsed = tasksByPriority.reduce((sum, task) => {
            const lapsed = (new Date().getTime() - new Date(task.startTime).getTime()) / 3600000;
            return sum + lapsed;
        }, 0);

        const timeToFinish = tasksByPriority.reduce((sum, task) => {
            if (task.endTime) {
                const toFinish = (new Date(task.endTime).getTime() - new Date().getTime()) / 3600000;
                return sum + (toFinish > 0 ? toFinish : 0);
            }
            return sum;
        }, 0);

        return {
            priority,
            pendingTasks: tasksCount,
            timeLapsed,
            timeToFinish,
        };
    });
};
