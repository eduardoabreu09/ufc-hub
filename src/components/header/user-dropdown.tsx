"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SignOutButton from "../ui/sign-out-button";
import { useSession } from "@/context/session-context";
import AvatarName from "../avatar-name";
import Link from "next/link";
import { User } from "lucide-react";

export default function UserDropdown() {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <AvatarName
            name={user?.name ?? "Usuário"}
            className="h-10 w-10"
            textSize="text-lg"
          />
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
        {user?.id && (
          <DropdownMenuItem>
            <Link
              href={`/home/profile/${user.id}`}
              className="flex items-center gap-2 w-full"
            >
              <User size={16} className="opacity-60" aria-hidden="true" />
              <span>Meu Perfil</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
