import { Loader } from "lucide-react";

const Loading = () => {

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader className="size-6 animate-spin text-neutral-500" />
    </div>
  );
};

export default Loading;
