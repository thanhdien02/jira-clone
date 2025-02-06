"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskTable from "@/features/tasks/components/task-table";
import { MdOutlineEdit } from "react-icons/md";

const TaskClient = () => {
  return (
    <main className="p-5 flex flex-col gap-y-5">
      <div className="flex justify-between items-center">
        <Button size={"sm"} variant={"outline"} className="shadow-none">
          <MdOutlineEdit className="mr-2" size={"16"} />
          Edit project
        </Button>
      </div>
      <Card className="p-5 shadow-none">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="gap-x-4 bg-white">
            <TabsTrigger value="account" className="!shadow-none bg-white">
              Table
            </TabsTrigger>
            <TabsTrigger value="password" className="!shadow-none bg-white">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calender" className="!shadow-none bg-white">
              Calender
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <TaskTable />
          </TabsContent>
          <TabsContent value="password">Kanban</TabsContent>
          <TabsContent value="calender">Calender.</TabsContent>
        </Tabs>
      </Card>
    </main>
  );
};

export default TaskClient;
