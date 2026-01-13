import { Button } from "@/components/ui/button";
import { MoreVerticalIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  GroupHeaderActions,
  GroupMemberManager,
  IsYouBadge,
} from "./group-details-client";
import { GroupRole } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getGroupById } from "@/features/groups/queries/get-group-by-id";
import { notFound } from "next/navigation";
import AvatarName from "../avatar-name";
import { Badge } from "../ui/badge";

interface GroupHeaderProps {
  groupId: number;
}

export async function GroupHeader({ groupId }: GroupHeaderProps) {
  const groupResult = await getGroupById(groupId);

  if (groupResult.isFailure) {
    return notFound();
  }

  const group = groupResult.getValue();

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
      <div className="flex items-center gap-3">
        <Link href="/home/group" className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2"
            aria-label="Voltar para grupos"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <AvatarName name={group.name} />
        <div>
          <h2 className="font-semibold text-sm">{group.name}</h2>
          <p className="text-xs text-muted-foreground">
            {group.users.length} membros
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Abrir detalhes do grupo"
            >
              <MoreVerticalIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Detalhes do grupo</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col items-center p-4 gap-4">
              <AvatarName
                name={group.name}
                className="h-24 w-24"
                textSize="text-4xl"
              />
              <div className="text-center">
                <h3 className="text-xl font-bold">{group.name}</h3>
                <p className="text-muted-foreground">{group.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {group._count?.messages || 0} mensagens enviadas
                </p>
              </div>
            </div>

            <Separator className="-mb-4" />

            <div className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">
                  Participantes ({group.users.length})
                </h4>
              </div>

              <GroupHeaderActions group={group} />

              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {group.users.map((userGroup) => (
                    <div
                      key={userGroup.userId}
                      className="flex items-center justify-between"
                    >
                      <Link
                        className="flex items-center gap-3"
                        href={`/home/profile/${userGroup.userId}`}
                      >
                        <AvatarName
                          name={userGroup.user.name}
                          className="h-8 w-8"
                        />
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm font-medium leading-none">
                            {userGroup.user.name}
                            {userGroup.role === GroupRole.ADMIN && (
                              <span className="ml-2">
                                <Badge>Admin</Badge>
                              </span>
                            )}
                            <span className="ml-2">
                              <IsYouBadge userId={userGroup.userId} />
                            </span>
                          </p>
                          {userGroup.user.course && (
                            <p className="text-xs text-muted-foreground">
                              {userGroup.user.course}
                            </p>
                          )}
                        </div>
                      </Link>
                      <GroupMemberManager
                        group={group}
                        memberId={userGroup.userId}
                        memberName={userGroup.user.name}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
