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
import { createTaskSchema } from "../schema";
import { DatePicker } from "@/components/date-picker";
import SelectPicker from "@/components/select-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Task, TaskStatus } from "../types";
import useUpdateTask from "../api/use-update-task";

interface EditTaskFormProps {
  onCancel?: () => void;
  initialValues: Task;
  assignee: { id: string; name: string }[];
  project: { id: string; name: string }[];
  taskId: string;
}
const EditTaskForm = ({
  onCancel,
  assignee,
  taskId,
  project,
  initialValues,
}: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      workspaceId: initialValues?.workspaceId,
      name: initialValues?.name,
      description: initialValues?.description,
      dueDate: initialValues?.dueDate
        ? new Date(initialValues?.dueDate)
        : undefined,
      projectId: initialValues?.projectId,
      status: initialValues?.status,
      assigneeId: initialValues?.assigneeId,
    },
  });
  const onSubmit = (data: z.infer<typeof createTaskSchema>) => {
    mutate(
      {
        param: {
          taskId: taskId,
        },
        json: data,
      },
      {
        onSuccess: () => {},
      }
    );
  };

  return (
    <Card
      className={cn(
        "w-full h-full border-none shadow-none",
        !onCancel && "p-4"
      )}
    >
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a new task</CardTitle>
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
                      disabled={false}
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
                    <SelectPicker
                      data={assignee}
                      {...field}
                      placeholder="Select assignee"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full px-2">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={TaskStatus.BACKLOG}>
                            Backlog
                          </SelectItem>
                          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                          <SelectItem value={TaskStatus.IN_PROGRESS}>
                            In progress
                          </SelectItem>
                          <SelectItem value={TaskStatus.IN_REVIEW}>
                            In review
                          </SelectItem>
                          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                    <SelectPicker
                      data={project}
                      {...field}
                      placeholder="Select project"
                    />
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
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={"lg"}
                className="w-fit ml-auto"
                disabled={isPending}
              >
                Edit task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditTaskForm;
