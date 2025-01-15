"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { RiAddCircleFill } from "react-icons/ri";
interface WorkspaceSwitcherProps {
  initialData?: string;
}
const WorkspaceSwitcher = ({ initialData }: WorkspaceSwitcherProps) => {
  console.log("🚀 ~ WorkspaceSwitcher ~ initialData:", initialData);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <p className="uppercase text-xs text-neutral-500">Workspaces</p>
        <RiAddCircleFill className="bg-white text-neutral-500 rounded-full size-5 cursor-pointer" />
      </div>
      <Select>
        <SelectTrigger className="w-full outline-none bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="No workspace selected" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple" className="h-12">
              <div className="flex justify-between items-center gap-x-3">
                <WorkspaceAvatar src="/anh1.png" name="Avatar" />
                <p className="truncate">workspace_1</p>
              </div>
            </SelectItem>
            <SelectItem value="name" className="h-12">
              <div className="flex justify-between items-center gap-x-3">
                <WorkspaceAvatar src="/anh1.png" name="Avatar" />
                <p className="truncate">workspace_2</p>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default WorkspaceSwitcher;
