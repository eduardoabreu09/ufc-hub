import { GroupDTO } from "./group";
import { MessageDTO } from "./message";
import { UserDTO } from "./user";

export interface EventDTO {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description?: string;
  body?: string;
  location?: string;
  eventDate: Date;

  createdBy: UserDTO;
  group?: GroupDTO;
  messages: MessageDTO[];
}
