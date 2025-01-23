"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface MemberClientProps {
  onCancel?: () => void;
}
const MemberClient = ({ onCancel }: MemberClientProps) => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();
  return (
    <Card className="w-full lg:max-w-xl shadow-none border-none outline-none">
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
      <CardContent>Content</CardContent>
    </Card>
  );
};

export default MemberClient;
