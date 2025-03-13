"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod";
import { schemaSignUp } from "../schema";
import useRegister from "../api/use-register";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

const SignUpCard = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof schemaSignUp>>({
    resolver: zodResolver(schemaSignUp),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof schemaSignUp>) => {
    mutate(data);
  };
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription className="line-clamp-2">
          By signing up, you agree to our{" "}
          <Link className="text-blue-700" href={"/privacy"}>
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link className="text-blue-700" href={"/service"}>
            Term of Service
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter name"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email address"
                      disabled={isPending}
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
                      placeholder="Enter password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" size={"lg"} disabled={isPending}>
              Sign up
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
          Sign up with Google
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
          Sign up with Github
        </Button>
      </CardContent>
      <CardFooter>
        <div className="mx-auto">
          Already have an account ?
          <Link href={"/sign-in"}>
            <span className="text-blue-700">&nbsp;Sign in</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignUpCard;
