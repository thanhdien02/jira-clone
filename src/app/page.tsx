"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="relative w-1/3 min-h-screen">
          <Image src={"/logo.svg"} alt="anh" fill className="object-cover" />
        </div>
      </div>
      <Button variant="destructive">Click</Button>
    </div>
  );
}
