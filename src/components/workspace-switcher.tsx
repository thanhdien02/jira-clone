"use client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetWorkspaces from "@/features/workspaces/api/use-get-workspaces";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { RiAddCircleFill } from "react-icons/ri";
import { Avatar, AvatarFallback } from "./ui/avatar";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

const WorkspaceSwitcher = () => {
  const { open } = useCreateWorkspaceModal();
  const workspaceId = useWorkspaceId();

  const router = useRouter();
  const { data: workspaces } = useGetWorkspaces();

  const onSelect = (id: string) => {
    router.push(`/workspaces/${id}`);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <p className="uppercase text-xs text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          className="bg-white text-neutral-500 rounded-full size-5 cursor-pointer"
          onClick={open}
        />
      </div>
      <Select onValueChange={onSelect} value={workspaceId}>
        <SelectTrigger className="w-full outline-none bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {workspaces?.documents.map((workspace) => (
              <SelectItem
                key={workspace.$id}
                value={workspace.$id}
                className="h-12"
              >
                <div className="flex justify-between items-center gap-x-3">
                  {workspace.imageUrl ? (
                    <WorkspaceAvatar src={workspace.imageUrl} name="Avatar" />
                  ) : (
                    <Avatar className="size-10 bg-blue-500 rounded-md">
                      <AvatarFallback className="uppercase bg-inherit text-white text-lg">
                        {workspace?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <p className="truncate">{workspace?.name}</p>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
