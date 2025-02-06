"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="min-h-screen bg-neutral-100">
      <div className="max-w-screen-2xl mx-auto p-4">
        <nav className="flex justify-between">
          <Image src="/logo.svg" width={152} priority height={56} alt="logo" />
          <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
            <Button variant="secondary">
              {isSignIn ? "Sign up" : "Sign in"}
            </Button>
          </Link>
        </nav>
        <div className="flex justify-center pt-4 md:pt-14">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
