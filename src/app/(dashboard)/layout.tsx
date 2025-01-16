import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import CreateWorkspaceModal from "@/features/workspaces/components/creare-workspacre-modal";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="min-h-screen w-full">
      <CreateWorkspaceModal />
      <div className="hidden lg:block lg:fixed top-0 left-0 w-[267px] h-full bg-neutral-100">
        <Sidebar />
      </div>
      <div className="lg:ml-[267px]">
        <div className="mx-auto max-w-screen-2xl">
          <div className="">
            <Navbar />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
