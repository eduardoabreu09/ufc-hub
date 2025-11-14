import { Participation } from "@prisma/client";
import { MessageDTO } from "./message";
import { UserDTO } from "./user";

export interface EventDTO {
  id: number;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  eventDate: Date;
  location: string;
  createdBy: UserDTO;
  imageUrl: string | null;
  participations: EventPaticipationSimpleDTO[];
  tags: EventTagDTO[];
  _count?: {
    participations: number;
  };
}

export interface EventTagDTO {
  name: string;
}

export interface EventPaticipationSimpleDTO {
  userId: number;
  participation: Participation;
}

export interface EventMessageDTO {
  id: number;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  eventDate: Date;
  location: string;
  createdBy: UserDTO;

  messages?: MessageDTO[];
  tags: EventTagDTO[];
  participations?: EventParticipationDTO[];
}

export interface EventParticipationDTO {
  userId: number;
  eventId: number;
  participation: Participation;
  user: UserDTO;
}
