import Image from "next/image";


interface WorkspaceAvatarProps {
  src: string;
  name: string;
}
const WorkspaceAvatar = ({ name, src }: WorkspaceAvatarProps) => {
  return (
    <div className="size-10 relative rounded-md overflow-hidden shrink-0">
      <Image src={src} alt={name} fill className="object-cover rounded-md" />
    </div>
  );
};

export default WorkspaceAvatar;
