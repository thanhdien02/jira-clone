"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  Loader,
  MoreVerticalIcon,
  TriangleAlert,
} from "lucide-react";

import useConfirm from "@/hooks/use-confirm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberRole } from "@/features/members/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useDeleteMember from "@/features/members/api/use-delete-member";
import useGetMember from "@/features/members/api/use-get-member";
import useGetMembers from "@/features/members/api/use-get-members";
import useUpdateMember from "@/features/members/api/use-update-member";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";

interface MemberClientProps {
  onCancel?: () => void;
  userId: string;
}
const MemberClient = ({ onCancel, userId }: MemberClientProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: currentMember, isLoading: currentMemberLoading } = useGetMember(
    { userId, workspaceId }
  );
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });
  const {
    mutate: mutateChangePermission,
    isPending: isPendingChangePermission,
  } = useUpdateMember();
  const { mutate: mutateDelete, isPending: isPendingDeleteMember } =
    useDeleteMember();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete member",
    "This will delete the member",
    "destructive"
  );
  const [OutDialog, confirmOut] = useConfirm(
    "Out workspace",
    "You will out the workspace",
    "destructive"
  );

  if (membersLoading || currentMemberLoading) {
    return (
      <div className="w-full h-[calc(100vh-105px)] flex justify-center items-center">
        <Loader className="animate-spin size-6 text-neutral-500" />
      </div>
    );
  }
  if (!currentMember || !members) {
    return (
      <div className="w-full h-[calc(100vh-105px)] flex flex-col gap-y-3 justify-center items-center">
        <TriangleAlert className="size-6 text-neutral-500" />
        <p className="text-base text-neutral-500 font-medium">
          No found Information
        </p>
      </div>
    );
  }

  const handleChangePermission = async (role: MemberRole, memberId: string) => {
    let permission: MemberRole;
    if (role === MemberRole.ADMIN) {
      permission = MemberRole.MEMBER;
    } else {
      permission = MemberRole.ADMIN;
    }
    mutateChangePermission({ json: { role: permission }, param: { memberId } });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();
    if (!ok) return;
    mutateDelete(
      { param: { memberId } },
      {
        onSuccess: () => {
          toast.success("Member deleted");
          window.location.reload();
        },
      }
    );
  };
  const handleOutWorkspace = async () => {
    const ok = await confirmOut();
    if (!ok) return;
    mutateDelete(
      { param: { memberId: currentMember.$id } },
      {
        onSuccess: () => {
          toast.success("Left the workspace");
          router.push(`/`);
        },
      }
    );
  };
  const isAdmin = (currentMember.role as MemberRole) === MemberRole.ADMIN;
  return (
    <Card className="w-full lg:max-w-xl shadow-none border-none outline-none">
      <OutDialog />
      <DeleteDialog />
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
        {members?.documents.map((member) => (
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
                  <DropdownMenuItem
                    asChild
                    disabled={
                      isPendingDeleteMember ||
                      isPendingChangePermission ||
                      !isAdmin ||
                      member.$id === currentMember.$id ||
                      members.documents.length === 1
                    }
                  >
                    <button
                      className="flex items-center gap-x-2 w-full"
                      onClick={() =>
                        handleChangePermission(member.role, member.$id)
                      }
                    >
                      <span>Change permission</span>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    disabled={
                      isPendingDeleteMember ||
                      isPendingChangePermission ||
                      !isAdmin ||
                      members.documents.length === 1
                    }
                  >
                    <button
                      className="flex items-center gap-x-2 w-full"
                      onClick={() => {
                        if (member.$id === currentMember?.$id) {
                          handleOutWorkspace();
                        } else {
                          handleDeleteMember(member.$id);
                        }
                      }}
                    >
                      <span>Remove</span>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        <div className="flex">
          <Button
            className={`ml-auto ${
              members.documents.length === 1 && "text-black/50"
            }`}
            onClick={handleOutWorkspace}
            disabled={
              isPendingChangePermission ||
              isPendingDeleteMember ||
              members.documents.length === 1
            }
          >
            Out workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberClient;
