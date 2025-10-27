import { GroupRole } from "@prisma/client";

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  course: string | null;
}

export interface UserGroupDTO {
  userId: number;
  groupId: number;
  role: GroupRole;
  user: UserDTO;
}
