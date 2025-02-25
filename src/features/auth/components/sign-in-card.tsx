"use client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { schemaLogin } from "../schema";
import useLogin from "../api/use-login";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

const SignInCard = () => {
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof schemaLogin>>({
    resolver: zodResolver(schemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof schemaLogin>) => {
    mutate(data);
  };
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl text-center">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      disabled={isPending}
                      placeholder="Enter email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      disabled={isPending}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size={"lg"} disabled={isPending}>
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="flex flex-col gap-4 mt-4">
        <Button
          className="w-full gap-x-2"
          variant={"secondary"}
          disabled={isPending}
          onClick={() => {
            signUpWithGoogle();
          }}
        >
          <FcGoogle />
          Login with Google
        </Button>
        <Button
          className="w-full gap-x-2"
          variant={"outline"}
          disabled={isPending}
          onClick={() => {
            signUpWithGithub();
          }}
        >
          <FaGithub />
          Login with Github
        </Button>
      </CardContent>

      <CardFooter>
        <div className="mx-auto">
          Don&apos;t have an account ?
          <Link href={"/sign-up"}>
            <span className="text-blue-700">&nbsp;Sign up</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignInCard;
