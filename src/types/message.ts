import { UserDTO } from "./user";

export interface MessageDTO {
  id: number;
  body: string;
  createdAt: Date;
  senderId: number;
  groupId?: number | null;
  eventId?: number | null;
  blogPostId?: number | null;
  sentBy: UserDTO;
}
