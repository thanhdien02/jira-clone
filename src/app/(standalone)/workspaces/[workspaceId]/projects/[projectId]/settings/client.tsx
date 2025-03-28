"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import useDeleteProject from "@/features/projects/api/use-delete-project";
import useGetProject from "@/features/projects/api/use-get-project";
import useUpdateProject from "@/features/projects/api/use-update-project";
import useProjectId from "@/features/projects/hooks/use-project-id";
import { updateProjectSchema } from "@/features/projects/schema";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useConfirm from "@/hooks/use-confirm";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ImageIcon, Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ProjectSettingsClient = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();
  const imageRef = useRef<HTMLInputElement>(null);
  const { data: project, isLoading: isProjectLoading } = useGetProject({
    projectId,
    workspaceId,
  });
  const { mutate, isPending } = useUpdateProject();
  const { mutate: mutateDeleteProject, isPending: isDeleteProjectPending } =
    useDeleteProject();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undone. Are you sure you want to delete this project?",
    "destructive"
  );
  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      workspaceId,
    },
  });
  const onSubmit = (data: z.infer<typeof updateProjectSchema>) => {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : undefined,
    };
    mutate({ form: finalData, param: { projectId } });
  };
  useEffect(() => {
    if (project) {
      form.setValue("name", project.name);
      form.setValue("image", project.imageUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };
  const handleDeleteProject = async () => {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    mutateDeleteProject(
      { param: { projectId } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}`);
        },
      }
    );
  };
  if (isProjectLoading) {
    return (
      <div className="h-[306px] w-full xl:max-w-xl">
        <Card className="h-full shadow-none outline-none border-none w-full flex items-center justify-center">
          <Loader className="size-5 text-neutral-500 animate-spin" />
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full lg:max-w-xl flex flex-col gap-y-5">
      <DeleteDialog />
      <Card className="shadow-none outline-none border-none w-full">
        <CardHeader className="!relative flex items-center justify-center !flex-row gap-x-5">
          <Button
            className="absolute left-6  flex items-center"
            onClick={() => {
              router.back();
            }}
            variant={"secondary"}
            size={"xs"}
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            <span className="text-sm">Back</span>
          </Button>
          <CardTitle className="!mt-0">Edit project</CardTitle>
        </CardHeader>
        <DottedSeparator className="my-2" />
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your project name"
                        disabled={isPending}
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
                  <div className="flex items-center justify-start gap-x-5">
                    <div className="relative shrink-0 size-[72px] rounded-md overflow-hidden border border-gray-100">
                      {field.value && field.value !== "undefined" ? (
                        <Image
                          src={
                            field.value instanceof File
                              ? URL.createObjectURL(field.value)
                              : field.value
                          }
                          className="object-cover"
                          fill
                          alt="Project image"
                        />
                      ) : (
                        <Avatar className="size-[72px] rounded-md">
                          <AvatarFallback className="rounded-md">
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
                        ref={imageRef}
                        accept=".jpg, .png, .svg, .jpeg"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {field.value && field.value !== "undefined" ? (
                        <Button
                          className="w-fit"
                          size={"xs"}
                          disabled={isPending}
                          variant={"destructive"}
                          type="button"
                          onClick={() => {
                            // field.onChange("");
                            form.setValue("image", "");
                            if (imageRef.current) {
                              imageRef.current.value = "";
                            }
                          }}
                        >
                          Remove image
                        </Button>
                      ) : (
                        <Button
                          size={"xs"}
                          type="button"
                          disabled={isPending}
                          variant={"teritary"}
                          className="w-fit"
                          onClick={(e) => {
                            e.preventDefault();
                            imageRef?.current?.click();
                          }}
                        >
                          Add image
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              />
              <Button className="ml-auto" type="submit" disabled={isPending}>
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="shadow-none outline-none border-none w-full">
        <CardHeader className="">
          <CardTitle className="!mt-0">Danger zone</CardTitle>
          <CardDescription>
            Deleting a project is irreversible and will remove all associated
            data.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-7">
          <div className="flex">
            <Button
              className="w-fit ml-auto"
              variant={"destructive"}
              type="button"
              disabled={isDeleteProjectPending}
              onClick={handleDeleteProject}
            >
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettingsClient;
