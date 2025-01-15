import UserButton from "@/features/auth/components/user-button";
import MobileSidebar from "./mobile-sidebar";

export function Navbar() {
  return (
    <div className="h-[76px] flex justify-between items-center px-5">
      <div className="hidden lg:flex flex-col">
        <h2 className="text-2xl font-semibold">Home</h2>
        <p className="text-base text-neutral-500">
          View tasks of your project here
        </p>
      </div>
      <MobileSidebar />
      <UserButton />
    </div>
  );
}
