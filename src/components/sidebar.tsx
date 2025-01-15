"use client";

import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";

const Sidebar = () => {
  return (
    <aside className="h-full p-4">
      <Link href={"/"} className=" w-full flex items-center">
        <Image alt="Logo" src="/logo.svg" width={164} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <div className="">
        <Navigation />
      </div>
    </aside>
  );
};

export default Sidebar;
