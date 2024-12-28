"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef, useState } from "react";

const CompanyPage = () => {
  const [name, setName] = useState<string>("thanh dien");
  // hello world

  const refName = useRef("van duc");
  return (
    <div className="">
      <div className=""></div>
      <Link href="/product" className="text-blue-500">
        Chuyen trang {name}
      </Link>
      <Button
        variant={"ghost"}
        onClick={() => {
          setName("ten moi");
          refName.current = "new name";
        }}
      >
        Forward
      </Button>
      <div>UseRef {refName.current}</div>
    </div>
  );
};

export default CompanyPage;
