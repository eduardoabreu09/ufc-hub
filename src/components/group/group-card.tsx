import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsersIcon, MessageCircleIcon, CalendarIcon } from "lucide-react";
import { Group } from "@/types/group";
import Link from "next/link";

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  // For now, we'll display the groups without user-specific admin/member status
  // This can be improved later to fetch current user server-side
  const memberCount = group._count?.users || group.users.length;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {group.description || "No description provided"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <UsersIcon className="h-4 w-4" />
            <span>{memberCount} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircleIcon className="h-4 w-4" />
            <span>{group._count?.messages || 0} messages</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3" />
          <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/group/${group.id}`} className="flex w-full">
            <Button className="flex-1">Open Chat</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
