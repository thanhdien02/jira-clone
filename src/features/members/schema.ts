import { z } from "zod";
import { MemberRole } from "./types";

export const updateMemberSchema = z.object({
  role: z.nativeEnum(MemberRole),
});
