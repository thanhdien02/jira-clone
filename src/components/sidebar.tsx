import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import Navigation from "./navigation";
import WorkspaceSwitcher from "./workspace-switcher";
import ProjectList from "./project-list";

const Sidebar = () => {
  return (
    <aside className="h-full p-4">
      <Link href={"/"} className=" w-full flex items-center">
        <Image alt="Logo" src="/logo.svg" priority width={164} height={48} />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <ProjectList />
    </aside>
  );
};

export default Sidebar;
