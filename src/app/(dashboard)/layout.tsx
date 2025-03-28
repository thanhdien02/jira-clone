import { Navbar } from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import CreateProjectModal from "@/features/projects/components/create-project-modal";
import EditProjectModal from "@/features/projects/components/edit-project-modal";
import CreateTaskModal from "@/features/tasks/components/create-task-modal";
import EditTaskModal from "@/features/tasks/components/edit-task-modal";
import CreateWorkspaceModal from "@/features/workspaces/components/create-workspace-modal";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <main className="min-h-screen w-full">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditProjectModal />
      <EditTaskModal />
      <div className="hidden lg:block fixed top-0 left-0 w-[267px] h-full bg-neutral-100 overflow-y-auto">
        <Sidebar />
      </div>
      <div className="lg:ml-[267px]">
        <div className="mx-auto max-w-screen-2xl">
          <Navbar />
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
};

export default Layout;
