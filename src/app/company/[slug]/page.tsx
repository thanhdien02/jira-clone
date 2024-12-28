"use client";
import { useParams } from "next/navigation";
const CompanyDetailPage = () => {
  const params = useParams();
  const { slug: namenew } = params;
  return (
    <>
      <div className="bg-gradient-to-b from-blue-500 to-red-500">
        Company detail {namenew}
      </div>
    </>
  );
};

export default CompanyDetailPage;
