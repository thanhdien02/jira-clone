"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetMembers from "@/features/members/api/use-get-members";
import useUpdateMember from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useConfirm from "@/hooks/use-confirm";
import { ArrowLeftIcon, Loader, MoreVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface MemberClientProps {
  onCancel?: () => void;
}
const MemberClient = ({ onCancel }: MemberClientProps) => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetMembers({ workspaceId });
  const { mutate, isPending } = useUpdateMember();
  const router = useRouter();
  const [PermissionDialog, confirmPermission] = useConfirm(
    "Change permissions role",
    "This will change the permissions role of the member",
    "destructive"
  );
  const handleChangePermission = async (role: MemberRole, memberId: string) => {
    const ok = await confirmPermission();
    if (!ok) return;
    if (role === MemberRole.ADMIN) {
      mutate({ json: { role: MemberRole.MEMBER }, param: { memberId } });
    } else {
      mutate({ json: { role: MemberRole.ADMIN }, param: { memberId } });
    }
  };
  return (
    <Card className="w-full lg:max-w-xl shadow-none border-none outline-none">
      <PermissionDialog />
      <CardHeader className="flex !flex-row justify-start items-center gap-x-4">
        <Button
          size="sm"
          variant="secondary"
          onClick={
            onCancel
              ? onCancel
              : () => router.push(`/workspaces/${workspaceId}`)
          }
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="!mt-0">Members</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        {(isLoading || isPending) && (
          <div className="min-h-[100px] w-full flex justify-center items-center">
            <Loader className="size-5 text-neutral-500 animate-spin" />
          </div>
        )}
        {!isPending &&
          !isLoading &&
          data?.map((member) => (
            <div key={member.$id} className="flex items-center justify-between">
              <div className="flex items-center gap-x-3">
                <Avatar className="rounded-md bg-blue-500">
                  <AvatarFallback className="font-medium text-white bg-inherit uppercase">
                    {member?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="truncate">{member?.name}</p>
                  <p className="text-neutral-400 text-xs">{member.role}</p>
                </div>
              </div>
              <div className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreVerticalIcon className="size-4 text-neutral-500 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <button
                        className="flex items-center gap-x-2"
                        onClick={() =>
                          handleChangePermission(member.role, member.$id)
                        }
                      >
                        <span>Change permission</span>
                      </button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <button className="flex items-center gap-x-2">
                        <span>Remove</span>
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default MemberClient;
