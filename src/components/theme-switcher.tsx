"use client";

import { Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full items-center justify-between"
        >
          <span>Alterar Tema</span>
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 high-contrast:scale-0 high-contrast:-rotate-90" />
          <Moon className="absolute right-3 h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 high-contrast:scale-0 high-contrast:rotate-90" />
          <Zap className="absolute right-3 h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all high-contrast:scale-100 high-contrast:rotate-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Escuro
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          Sistema
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("high-contrast")}>
          Alto Contraste
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
