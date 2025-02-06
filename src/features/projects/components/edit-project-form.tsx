"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createProjectSchema } from "../schema";
import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import useUpdateProject from "../api/use-update-project";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues?: {
    id: string;
    name: string;
    imageUrl: string;
  };
}
const EditProjectForm = ({ onCancel, initialValues }: EditProjectFormProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useUpdateProject();
  const refImage = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: initialValues?.name,
      image: initialValues?.imageUrl,
      workspaceId,
    },
  });
  const onSubmit = (data: z.infer<typeof createProjectSchema>) => {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : "",
      workspaceId
    };
    mutate({
      form: finalData,
      param: { projectId: initialValues?.id as string },
    });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };
  return (
    <Card
      className={cn(
        "bg-white w-full h-full shadow-none border-none",
        !onCancel && "p-4"
      )}
    >
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit project</CardTitle>
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
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter project name"
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
                      <p className="text-sm font-medium">Project Icon</p>
                      <p className="text-sm text-neutral-500">
                        JPG, PNG, SVG or JPEG, max 1mb
                      </p>
                    </div>
                    <input
                      type="file"
                      disabled={isPending}
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
                        disabled={isPending}
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
                        disabled={isPending}
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
                type="button"
                variant="secondary"
                size={"lg"}
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={"lg"}
                className="w-fit ml-auto"
                disabled={isPending}
              >
                Edit project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditProjectForm;
