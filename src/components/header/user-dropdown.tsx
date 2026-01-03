"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SignOutButton from "../ui/sign-out-button";
import { useSession } from "@/context/session-context";
import AvatarName from "../avatar-name";

export default function UserDropdown() {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <AvatarName name={user?.name ?? "Usuário"} className="h-8 w-8" />
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
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
