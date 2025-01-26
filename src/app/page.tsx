
import { Dashboard } from "@/components/Dashboard";
import SignOut from "@/components/SignOut";
import { TaskList } from "@/components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href={"/"} className="text-2xl font-extrabold tracking-widest border-2 border-t-blue-500 border-l-blue-500 border-b-sky-300 border-r-sky-300 px-2 py-1 rounded-lg">
          <span className="text-blue-500">Click</span>
          <span className="text-sky-300">Kar</span>
        </Link>
        <SignOut/>
      </div>

      <Tabs defaultValue="task-list">
        <TabsList className="bg-gradient-to-br from-blue-900 to-sky-800 text-white w-full h-12 px-2">
          <TabsTrigger className="w-full text-center py-2" value="task-list">Task list</TabsTrigger>
          <TabsTrigger className="w-full text-center py-2" value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        <TabsContent value="task-list">
          <TaskList />
        </TabsContent>
      </Tabs>
    </div>
  );
}