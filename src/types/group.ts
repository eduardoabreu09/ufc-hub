import { MessageDTO } from "./message";
import { UserDTO, UserGroupDTO } from "./user";

export interface GroupMessagesDTO {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  createdBy: UserDTO;
  creatorId: number;
  users: UserGroupDTO[];
  messages?: MessageDTO[];
  _count?: {
    users: number;
    messages: number;
  };
}

export interface GroupDTO {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  _count?: {
    users: number;
    messages: number;
  };
}
