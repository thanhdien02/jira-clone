import { Models } from "node-appwrite";

export type Workspace = Models.Document & {
  name: string;
  userId: string;
  inviteCode: string;
  imageUrl: string;
};
