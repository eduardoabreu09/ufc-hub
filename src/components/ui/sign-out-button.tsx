"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "./dropdown-menu";
import { logout } from "@/features/session/actions/logout";

export default function SignOutButton() {
  return (
    <DropdownMenuItem onClick={() => logout()}>
      <LogOut size={16} className="opacity-60" aria-hidden="true" />
      <span>Sair</span>
    </DropdownMenuItem>
  );
}
