import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
  src: string;
  name: string;
  className?: string;
}
const ProjectAvatar = ({ name, src, className }: ProjectAvatarProps) => {
  return (
    <>
      {src ? (
        <div
          className={cn(
            "size-5 relative rounded-md overflow-hidden shrink-0",
            className
          )}
        >
          <Image
            src={src}
            alt={name}
            fill
            className="object-cover rounded-md"
          />
        </div>
      ) : (
        <Avatar className="size-5 bg-blue-500 rounded-md">
          <AvatarFallback className="font-medium text-white uppercase bg-blue-500 text-xs">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </>
  );
};

export default ProjectAvatar;
