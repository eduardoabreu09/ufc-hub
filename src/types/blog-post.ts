import type { MessageDTO } from "./message";
import type { UserDTO } from "./user";

export interface BlogPostTagDTO {
  name: string;
}

export interface BlogPostCountDTO {
  messages: number;
}

export interface BlogPostBaseDTO {
  id: number;
  title: string;
  body: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
}

export interface BlogPostDTO extends BlogPostBaseDTO {
  author: UserDTO;
  tags?: BlogPostTagDTO[];
  _count?: BlogPostCountDTO;
}

export interface BlogPostWithMessagesDTO extends BlogPostDTO {
  messages?: MessageDTO[];
}
