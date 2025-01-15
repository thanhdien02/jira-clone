"use client";

import useWorkspaceId from "@/features/workspaces/hooks/use-workspace-id";
import { SettingsIcon, UsersIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import Link from "next/link";
const routes = [
  {
    href: "/",
    label: "Home",
    icon: GoHome,
    isActiveIcon: GoHomeFill,
  },
  {
    href: "/tasks",
    label: "My tasks",
    icon: GoCheckCircle,
    isActiveIcon: GoCheckCircleFill,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    isActiveIcon: SettingsIcon,
  },
  {
    href: "/members",
    label: "Members",
    icon: UsersIcon,
    isActiveIcon: UsersIcon,
  },
];

const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-y-2">
      {routes.map((route, index) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.isActiveIcon : route.icon;
        return (
          <Link href={fullHref} key={index}>
            <div
              className={cn(
                "flex justify-start items-center hover:text-primary rounded-md font-medium text-neutral-500  p-2.5 gap-x-3",
                isActive && "bg-white"
              )}
            >
              <Icon
                className={cn(
                  "size-5 text-neutral-500",
                  isActive && "text-black"
                )}
              />
              <p className="truncate">{route.label}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Navigation;
