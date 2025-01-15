"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useCurrent from "../api/use-current";
import { Loader, LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotted-separator";
import useLogout from "../api/use-logout";

const UserButton = () => {
  const { mutate: logout } = useLogout();
  const { data, isLoading } = useCurrent();
  const firstName = data?.user.name.charAt(0).toUpperCase();

  if (isLoading) {
    return (
      <div className="size-10 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
        <Loader className="size-4 animate-spin" />
      </div>
    );
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="relative outline-none">
        <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
          <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
            {firstName}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="top" className="w-52">
        <div className="flex items-center justify-center text-center p-4">
          <div>
            <div className="flex items-center justify-center">
              <Avatar className="size-12 border border-neutral-300">
                <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
                  {firstName}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col mt-2">
              <p className="text-base">{data?.user.name}</p>
              <p className="text-xs text-neutral-400">{data?.user.email}</p>
            </div>
          </div>
        </div>
        <DottedSeparator direction="horizontal"></DottedSeparator>
        <DropdownMenuItem
          onClick={() => {
            logout();
          }}
          className="text-amber-700 flex items-center justify-center gap-x-2 h-10 cursor-pointer font-medium"
        >
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
