import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProjectAvatarProps {
  image: string;
  name: string;
  className?: string;
}
const ProjectAvatar = ({ name, image, className }: ProjectAvatarProps) => {
  return (
    <Avatar className={cn("size-6 bg-blue-500 rounded-md", className)}>
      <AvatarImage src={image} alt="Image" />
      <AvatarFallback className="font-medium text-white uppercase bg-blue-500 text-sm">
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProjectAvatar;
