import { Participation } from "@prisma/client";
import { MessageDTO } from "./message";
import { UserDTO } from "./user";
import { TagDto } from "./tag";

interface EventDTOBase {
  id: number;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  eventDate: Date;
  duration: number;
  location: string;
  createdBy: UserDTO;
  creatorId: number;
  imageUrl: string | null;
  tags: TagDto[];
}

export interface EventDTO extends EventDTOBase {
  participations: EventPaticipationSimpleDTO[];
  _count?: {
    participations: number;
  };
}

export interface EventPaticipationSimpleDTO {
  userId: number;
  participation: Participation;
}

export interface EventDetailsDTO extends EventDTOBase {
  participations?: EventParticipationDTO[];
}

export interface EventParticipationDTO {
  userId: number;
  participation: Participation;
  user: UserDTO;
}
