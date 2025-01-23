"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createWorkspaceSchema } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeftIcon, Copy, ImageIcon, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn, generateInviteCode } from "@/lib/utils";
import useWorkspaceId from "../hooks/use-workspace-id";
import useUpdateWorkspace from "../api/use-update-workspace";
import useGetWorkspace from "../api/use-get-workspace";
import { toast } from "sonner";
import useResetInviteCode from "../api/use-update-invite-code";
import useConfirm from "@/hooks/use-confirm";
import useDeleteWorkspace from "../api/use-delete-workspace ";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
}
const EditWorkspaceForm = ({ onCancel }: EditWorkspaceFormProps) => {
  const { mutate: mutateUpdateWorkspace, isPending: isPendingUpdateWorkspace } =
    useUpdateWorkspace();
  const { mutate: mutateRestInvite, isPending: isPendingResetInvite } =
    useResetInviteCode();
  const { mutate: mutateDelete, isPending: isPendingDelete } =
    useDeleteWorkspace();

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset invite link",
    "This will invalidate the current invite link",
    "destructive"
  );
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "This action cannot be undone",
    "destructive"
  );
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });
  const router = useRouter();
  const [linkInviteCode, setLinkInviteCode] = useState<
    string | null | undefined
  >("");
  const refImage = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = (data: z.infer<typeof createWorkspaceSchema>) => {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    mutateUpdateWorkspace({ form: finalData, param: { workspaceId } });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const handleResetInvite = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    const newInviteCode = generateInviteCode(6);
    mutateRestInvite({
      json: { inviteCode: newInviteCode },
      param: { workspaceId },
    });
  };

  const handleDeleteWorkspace = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    mutateDelete(
      { param: { workspaceId } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
    // To do delete workspaces
  };
  useEffect(() => {
    if (workspace?.$id && workspace?.inviteCode) {
      form.setValue("name", workspace?.name);
      form.setValue("image", workspace?.imageUrl ? workspace?.imageUrl : "");
      setLinkInviteCode(
        `${window.location.origin}/workspaces/${workspaceId}/join/${workspace?.inviteCode}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-137px)]">
        <Loader className="size-6 text-neutral-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-xl flex flex-col gap-y-5">
      <ResetDialog />
      <DeleteDialog />
      <Card className={cn("bg-white w-full h-full shadow-none border-none")}>
        <CardHeader className="flex flex-row gap-x-4 justify-start p-7 items-center">
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
          <CardTitle className="text-xl font-bold !mt-0 truncate">
            Edit workspace
          </CardTitle>
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
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter project name"
                        disabled={isPendingUpdateWorkspace}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <div className="flex justify-start items-center gap-x-4">
                    <div className="shrink-0 relative size-[72px] rounded-md overflow-hidden">
                      {field.value ? (
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          className="object-cover"
                          fill
                          alt="Image workspace"
                        />
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback>
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <div className="flex flex-col gap-y-1">
                        <p className="text-sm font-medium">Workspace Icon</p>
                        <p className="text-sm text-neutral-500">
                          JPG, PNG, SVG or JPEG, max 1mb
                        </p>
                      </div>
                      <input
                        type="file"
                        disabled={isPendingUpdateWorkspace}
                        ref={refImage}
                        accept=".jpg, .png, .jpeg, .svg"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {field.value ? (
                        <Button
                          variant={"destructive"}
                          type={"button"}
                          className="w-fit"
                          disabled={isPendingUpdateWorkspace}
                          size={"xs"}
                          onClick={() => {
                            field.onChange(null);
                            if (refImage.current) {
                              refImage.current.value = "";
                            }
                          }}
                        >
                          Remove image
                        </Button>
                      ) : (
                        <Button
                          variant={"teritary"}
                          className="w-fit"
                          type="button"
                          disabled={isPendingUpdateWorkspace}
                          size={"xs"}
                          onClick={(e) => {
                            e.preventDefault();
                            refImage.current?.click();
                          }}
                        >
                          Upload image
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              />
              <DottedSeparator className="my-4" />
              <div className="flex justify-between items-center">
                <Button
                  type="submit"
                  size={"lg"}
                  className="w-fit ml-auto"
                  disabled={isPendingUpdateWorkspace}
                >
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className={cn("bg-white w-full h-full shadow-none border-none")}>
        <CardHeader className="flex flex-row gap-x-4 justify-start p-7 items-center">
          <CardTitle className="text-lg font-bold !mt-0 truncate">
            Invite Members
          </CardTitle>
        </CardHeader>

        <CardContent className="px-7">
          <div className="flex items-center gap-x-4">
            <Input
              type="text"
              value={linkInviteCode ? linkInviteCode : ""}
              disabled
            />
            <Button
              type="button"
              size={"lg"}
              variant={"outline"}
              className="!p-0 !w-[60px]"
              onClick={() => {
                navigator.clipboard.writeText(linkInviteCode as string);
                toast.success("Copy link succeeded");
              }}
            >
              <Copy className="size-4 text-black"></Copy>
            </Button>
          </div>
          <div className="mt-7">
            <Button
              className="flex ml-auto w-fit"
              size={"sm"}
              onClick={handleResetInvite}
              variant="destructive"
              disabled={isPendingResetInvite}
            >
              Reset invite
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className={cn("bg-white w-full h-full shadow-none border-none")}>
        <CardHeader className="p-7">
          <CardTitle className="text-lg font-bold !mt-0 truncate">
            Danger Zone
          </CardTitle>
          <CardDescription>
            Deleting a workspace is irreversible and will remove all associated
            data.
          </CardDescription>
        </CardHeader>
        <DottedSeparator className="mb-7 px-7" />
        <CardContent className="px-7">
          <div>
            <Button
              className="flex ml-auto w-fit"
              size={"sm"}
              disabled={isPendingDelete}
              variant={"destructive"}
              onClick={handleDeleteWorkspace}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditWorkspaceForm;
