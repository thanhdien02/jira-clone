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
const formSignUp = z.object({
  username: z
    .string()
    .min(4, { message: "Username must have latest 4 character" })
    .max(256, { message: "Username must have less than 256 character" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must have latest 8 character" })
    .max(256, { message: "Password must have less than 256 character" }),
});
const SignUpCard = () => {
  const form = useForm<z.infer<typeof formSignUp>>({
    resolver: zodResolver(formSignUp),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof formSignUp>) => {
    console.log(data);
  };
  return (
    <Card className="w-full h-full md:w-[487] border-none shadow-none">
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
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter username"
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" size={"lg"}>
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardFooter className="flex flex-col gap-4 mt-4">
        <Button className="w-full gap-x-2" variant={"secondary"}>
          <FcGoogle />
          Sign up with Google
        </Button>
        <Button className="w-full gap-x-2" variant={"outline"}>
          <FaGithub />
          Sign up with Github
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpCard;
