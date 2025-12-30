import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsersIcon, MessageCircleIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { GroupDTO } from "@/types/group";
import { formatDateTime } from "@/lib/utils";

interface GroupCardProps {
  group: GroupDTO;
}

export function GroupCard({ group }: GroupCardProps) {
  const memberCount = group._count?.users;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {group.description || "Sem descrição"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" />
            <span>{memberCount} membros</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon className="h-4 w-4 text-primary" />
            {group._count?.messages ? (
              <Badge variant="secondary">
                {group._count.messages}{" "}
                {group._count.messages === 1 ? "nova" : "novas"}
              </Badge>
            ) : (
              <span>Nenhuma mensagem nova</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>Criado em: {formatDateTime(group.createdAt)}</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/home/group/${group.id}`} className="flex w-full">
            <Button className="flex-1">Abrir Chat</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
