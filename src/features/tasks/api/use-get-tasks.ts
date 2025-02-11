import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskStatus } from "../types";

interface UseGetTasksProps {
  projectId: string;
  workspaceId: string;
  search: string | null;
  assigneeId: string | null;
  status: TaskStatus | null;
  dueDate: string | null;
}
const useGetTasks = ({
  workspaceId,
  projectId,
  search,
  assigneeId,
  status,
  dueDate,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
      workspaceId,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId,
          search: search ?? undefined,
          assigneeId: assigneeId ?? undefined,
          status: status ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get tasks");
      }
      const { data } = await response.json();
      return data;
    },
  });

  return query;
};

export default useGetTasks;
