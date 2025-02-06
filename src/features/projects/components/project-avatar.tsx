import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
  src: string;
  name: string;
  className?: string;
}
const ProjectAvatar = ({ name, src, className }: ProjectAvatarProps) => {
  return (
    <div
      className={cn(
        "size-5 relative rounded-md overflow-hidden shrink-0",
        className
      )}
    >
      <Image src={src} alt={name} fill className="object-cover rounded-md" />
    </div>
  );
};

export default ProjectAvatar;
