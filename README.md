
# Click-Kar : Task Management Dashboard API

A comprehensive API built with **Next.js** and **Prisma** for managing tasks and providing analytics for a task management dashboard. This project enables task creation, updating, deletion, and a detailed summary view for both completed and pending tasks. The dashboard provides key performance metrics such as average task time, task completion rates, and priority-based breakdowns.

---

## Features

### API Features:
- **Task Management**:
  - Create new tasks with attributes like `title`, `description`, `priority`, `startTime`, `endTime`, and `status`.
  - Update existing tasks.
  - Delete tasks.
- **Dashboard Analytics(Under Development)**:
  - Provides a high-level summary of tasks:
    - Total tasks.
    - Percentage of tasks completed and pending.
    - Average time spent on completed tasks.
  - Pending task summary:
    - Total pending tasks.
    - Total time lapsed since task initiation.
    - Estimated time to finish pending tasks.
    - Priority-based task breakdown (always displays five rows for priorities 1 to 5).

---

## Technologies Used

- **Backend & Frontend**: [Next.js](https://nextjs.org/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- **Authentication**: JWT-based authentication for securing APIs.
- **Hosting**: Vercel (frontend).
- **Language**: TypeScript for type safety.

---

## Project Structure

```
.
├── prisma/                   # Prisma schema and migrations
├── pages/api/                # API routes for task management and analytics
│   │   ├── createTask        # Create a new task
│   │   ├── updateTask        # Update an existing task
│   │   ├── deleteTask         # Delete a task
│   │   └── getTasks      # Dashboard analytics data
├── utils/                    # Helper utilities (e.g., authentication, validations)
├── public/                   # Static assets
└── README.md                 # Project documentation


```
---

## Endpoints

### Task Endpoints

#### **Create Task**
**URL**: `/api/createTask`  
**Method**: `POST`  
**Request Body**:
```json
{
    "title": "Task title",
    "description": "Task description",
    "priority": 1,
    "startTime": "2024-01-01T09:00:00.000Z",
    "endTime": "2024-01-01T11:00:00.000Z",
    "status": "pending"
}
```

#### **Update Task**
**URL**: `/api/updateTask`  
**Method**: `PUT`  
**Request Body**:
```json
{
    "id": "task-id",
    "updates": {
        "title": "Updated title",
        "status": "completed"
    }
}
```

#### **Delete Task**
**URL**: `/api/deleteTask`  
**Method**: `DELETE`  
**Request Body**:
```json
{
    "id": "task-id"
}
```

#### **Get All Task**
**URL**: `/api/getTasks`  
**Method**: `GET`  


<!-- ### Dashboard Analytics

#### **Get Dashboard Data**
**URL**: `/api/tasks/dashboard`  
**Method**: `GET`  
**Response**:
```json
{
    "success": true,
    "data": {
        "summary": {
            "totalTasks": 25,
            "tasksCompletedPercentage": 40,
            "tasksPendingPercentage": 60,
            "avgTimePerCompletedTask": 3.5
        },
        "pendingTaskSummary": {
            "totalPendingTasks": 15,
            "totalTimeLapsed": 56,
            "estimatedTimeToFinish": 24,
            "prioritySummary": [
                {
                    "priority": 1,
                    "pendingTasks": 3,
                    "timeLapsed": 12,
                    "timeToFinish": 8
                },
                {
                    "priority": 2,
                    "pendingTasks": 5,
                    "timeLapsed": 6,
                    "timeToFinish": 3
                },
                {
                    "priority": 3,
                    "pendingTasks": 1,
                    "timeLapsed": 8,
                    "timeToFinish": 7
                }
            ]
        }
    }
}
```

--- -->

## Installation and Setup

### Prerequisites
- Node.js >= 17.x
- PostgreSQL database

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/AnchalDevBytes/click-kar.git
   cd clik-kar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/taskdb
   JWT_SECRET=your-secret-key
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

---

### Example Workflow
1. Create tasks using the `/api/tasks/create` endpoint.
2. View analytics data via the `/api/tasks/dashboard` endpoint.
3. Update or delete tasks using their respective endpoints.

---

## Future Enhancements

- Add filters and sorting options for tasks.
- Implement task reminders and notifications.
- Develop a frontend to visualize dashboard analytics and manage tasks.
- Add pagination for large datasets.

---

## Currently its under Development, Deployed this for assignment of Reunion company assignment