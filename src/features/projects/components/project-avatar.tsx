import Image from "next/image";

interface ProjectAvatarProps {
  src: string;
  name: string;
}
const ProjectAvatar = ({ name, src }: ProjectAvatarProps) => {
  return (
    <div className="size-5 relative rounded-md overflow-hidden shrink-0">
      <Image src={src} alt={name} fill className="object-cover rounded-md" />
    </div>
  );
};

export default ProjectAvatar;
