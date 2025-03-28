"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { ArrowLeftIcon, Loader, TriangleAlert } from "lucide-react";
import useGetWorkspaceInfo from "@/features/workspaces/api/use-get-workspace-info";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import useJoinWorkspace from "@/features/workspaces/api/use-join-workspace";
import useJoinInviteCode from "@/features/workspaces/hooks/use-join-invite-code";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
const JoinWorkspaceClient = () => {
  const router = useRouter();
  const inviteCode = useJoinInviteCode();
  const workspaceId = useWorkspaceId();
  const { mutate: mutateJoin, isPending } = useJoinWorkspace();
  const { data: workspaceInfo, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  const handleJoinWorkspace = () => {
    mutateJoin({ json: { code: inviteCode }, param: { workspaceId } });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-105px)] flex justify-center items-center">
        <Loader className="animate-spin size-6 text-neutral-500" />
      </div>
    );
  }
  if (!workspaceInfo) {
    return (
      <div className="w-full h-[calc(100vh-105px)] flex flex-col gap-y-3 justify-center items-center">
        <TriangleAlert className="size-6 text-neutral-500" />
        <p className="text-base text-neutral-500 font-medium">
          No found Information
        </p>
      </div>
    );
  }
  return (
    <Card className="w-full lg:max-w-xl outline-none border-none shadow-none">
      <CardHeader className="flex !flex-row justify-start items-center gap-x-4">
        <Button
          size={"sm"}
          variant={"outline"}
          onClick={() => {
            router.push("/");
          }}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-2xl font-bold !mt-0">
          Join Workspace
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-start gap-x-4">
          <div className="relative size-12 rounded-md">
            {workspaceInfo?.imageUrl ? (
              <Image
                src={workspaceInfo?.imageUrl}
                className="object-cover rounded-md"
                fill
                alt="Workspace Avatar"
              />
            ) : (
              <Avatar className="size-12 rounded-md bg-blue-500">
                <AvatarFallback className="uppercase bg-blue-500 text-white text-xl">
                  {workspaceInfo?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-medium">{workspaceInfo?.name}</p>
          </div>
        </div>
        <DottedSeparator className="my-7" />
        <div className="flex justify-between items-center">
          <Button
            disabled={isPending}
            size="lg"
            variant={"outline"}
            onClick={() => {
              router.push("/");
            }}
          >
            Cancel
          </Button>
          <Button disabled={isPending} size="lg" onClick={handleJoinWorkspace}>
            Join workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinWorkspaceClient;
