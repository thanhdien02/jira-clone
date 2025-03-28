import { Models } from "node-appwrite";

export enum MemberRole {
  // eslint-disable-next-line no-unused-vars
  ADMIN = "ADMIN",
  // eslint-disable-next-line no-unused-vars
  MEMBER = "MEMBER",
}

export type Member = Models.Document & {
  workspaceId: string;
  userId: string;
  role: MemberRole;
};
