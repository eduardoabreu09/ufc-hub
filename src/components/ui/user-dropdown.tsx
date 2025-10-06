import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/features/session/queries/get-current-user";

import { LogOut, Settings } from "lucide-react";
import { Suspense } from "react";

export default async function UserDropdown() {
  return (
    <Suspense
      fallback={
        <Avatar className="size-8">
          <AvatarImage
            src="/default-avatar.jpg"
            width={32}
            height={32}
            alt="Profile image"
          />
          <AvatarFallback>Oi</AvatarFallback>
        </Avatar>
      }
    >
      <UserLoadedDropdown />
    </Suspense>
  );
}

async function UserLoadedDropdown() {
  const user = await getCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-8">
            <AvatarImage
              src="/default-avatar.jpg"
              width={32}
              height={32}
              alt="Profile image"
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {user?.name || "Usuário"}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {user?.email || "Usuário"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings size={16} className="opacity-60" aria-hidden="true" />
            <span>Configurações</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut size={16} className="opacity-60" aria-hidden="true" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
