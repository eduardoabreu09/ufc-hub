"use client";

import { GroupDTO } from "@/types/group";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateGroupDialog } from "./group-dialog";
import { useSidebar } from "../ui/sidebar";
import AvatarName from "../avatar-name";

interface GroupSidebarProps {
  groups: GroupDTO[];
}

export function GroupSidebar({ groups }: GroupSidebarProps) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { setOpen } = useSidebar();

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full md:border-r bg-background w-full md:w-80 lg:w-96">
      <div className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Grupos</h2>
          <CreateGroupDialog />
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            Nenhum grupo encontrado.
          </div>
        ) : (
          <div className="flex flex-col">
            {filteredGroups.map((group) => (
              <Link
                key={group.id}
                href={`/home/group/${group.id}`}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-accent transition-colors border-b last:border-0",
                  pathname === `/home/group/${group.id}` && "bg-accent"
                )}
                onClick={() => setOpen(false)}
              >
                <AvatarName name={group.name} />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium truncate">{group.name}</span>
                    {group._count?.messages !== undefined &&
                      group._count.messages > 0 && (
                        <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                          {group._count.messages}
                        </span>
                      )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {group.description || "Sem descrição"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
