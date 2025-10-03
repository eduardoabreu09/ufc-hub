import { GroupRole } from "@prisma/client";

export interface Group {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  creatorId: number;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  users: UserGroup[];
  messages?: GroupMessage[];
  _count?: {
    users: number;
    messages: number;
  };
}

export interface UserGroup {
  userId: number;
  groupId: number;
  role: GroupRole;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
    course: string | null;
  };
}

export interface GroupMessage {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  senderId: number;
  groupId: number | null;
  sentBy: {
    id: number;
    name: string;
    email: string;
    course: string | null;
  };
}

export interface CreateGroupData {
  name: string;
  description?: string;
}
