"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { createTaskSchema } from "../schema";
import { DatePicker } from "@/components/date-picker";
import SelectPicker from "@/components/select-picker";

interface CreateTaskFormProps {
  onCancel?: () => void;
  assignee?: { id: string; name: string }[];
  project?: { id: string; name: string }[];
}
const CreateTaskForm = ({
  onCancel,
  assignee,
  project,
}: CreateTaskFormProps) => {
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema.omit({ workspaceId: true })),
    defaultValues: {
      workspaceId,
    },
  });
  const onSubmit = (data: z.infer<typeof createTaskSchema>) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
  };

  return (
    <Card
      className={cn(
        "bg-white w-full h-full shadow-none border-none",
        !onCancel && "p-4"
      )}
    >
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Create a new task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter task name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <DatePicker {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignees</FormLabel>
                  <FormControl>
                    <SelectPicker data={assignee} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projects</FormLabel>
                  <FormControl>
                    <SelectPicker data={project} {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DottedSeparator className="my-4" />
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="secondary"
                size={"lg"}
                onClick={onCancel}
                disabled={false}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={"lg"}
                className="w-fit ml-auto"
                disabled={false}
              >
                Create task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateTaskForm;
