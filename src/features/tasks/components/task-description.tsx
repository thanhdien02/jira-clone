"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Task } from "../types";
import useUpdateTask from "../api/use-update-task";
import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import { PencilIcon } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
interface TaskDescriptionProps {
  data: Task & { assignee: Member; project: Project };
}
const TaskDescription = ({ data }: TaskDescriptionProps) => {
  const [isActive, setIsActive] = useState(false);

  const [description, setDescription] = useState(data.description);
  const { mutate, isPending } = useUpdateTask();

  const debounced = useDebouncedCallback(
    // function
    (value: string) => {
      console.log("object: " + value);
      setDescription(value);
    },
    // delay in ms
    1000
  );
  const handleDescriptionUpdate = () => {
    mutate(
      { json: { description }, param: { taskId: data.$id } },
      { onSuccess: () => setIsActive(false) }
    );
  };
  return (
    <div className="flex-1 text-sm text-neutral-600 ">
      <div className="flex items-center justify-between">
        <p className="font-medium">Edit task description</p>
        <Button
          size={"xs"}
          onClick={() => {
            setIsActive((prev) => {
              return !prev;
            });
          }}
          variant={"secondary"}
          className="gap-x-1"
        >
          <PencilIcon className="size-4" />
          Edit
        </Button>
      </div>
      <div className="mt-4">
        <Textarea
          placeholder="Description"
          defaultValue={description}
          disabled={isPending || isActive}
          onChange={(e) => {
            debounced(e.target.value);
          }}
          className="min-h-[120px] focus-visible:ring-offset-0 focus-visible:ring-[0px]"
        ></Textarea>
        <div className="flex justify-end mt-2">
          <Button
            disabled={isPending || isActive}
            onClick={handleDescriptionUpdate}
            type="button"
            size={"sm"}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDescription;
