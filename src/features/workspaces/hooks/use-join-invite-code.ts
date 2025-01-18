import { useParams } from "next/navigation";

const useJoinInviteCode = () => {
  const params = useParams();
  return params.inviteCode as string;
};

export default useJoinInviteCode;
