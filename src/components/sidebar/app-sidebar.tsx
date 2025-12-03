"use client";

import { SearchForm } from "@/components/ui/search-form";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { logout } from "@/features/session/actions/logout";
import { useActionState, useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar1Icon,
  CalendarDays,
  Home,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";

const navigation = [
  {
    title: "Seções",
    url: "/",
    items: [
      {
        title: "Home",
        url: "/home",
        icon: Home,
      },
      {
        title: "Grupos",
        url: "/home/group",
        icon: Users,
      },
      {
        title: "Eventos",
        url: "/home/event",
        icon: CalendarDays,
      },
      {
        title: "Calendário",
        url: "/home/calendar",
        icon: Calendar1Icon,
      },
    ],
  },
  {
    title: "Outros",
    url: "#",
    items: [
      {
        title: "Configurações",
        url: "#",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [state, action, isPending] = useActionState(logout, undefined);
  const pathname = usePathname();
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    setClientPathname(pathname);
  }, [pathname]);

  const isActive = useCallback(
    (url: string) => {
      let parsedPath = "";
      const splitPath = clientPathname?.split("/");
      if (splitPath.length > 3) {
        splitPath.pop();
      }
      parsedPath = splitPath.join("/");
      if (parsedPath !== "") {
        return parsedPath === url;
      }
      return clientPathname === url;
    },
    [clientPathname],
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-3 [&>svg]:size-auto"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  src={"/logo.svg"}
                  height={60}
                  width={60}
                  alt="UFC Hub Logo"
                  priority
                />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium">UFC Hub</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <hr className="border-t border-border mx-2 -mt-px" />
        {/*<SearchForm className="mt-3" />*/}
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/60">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                      isActive={isActive(item.url)}
                    >
                      <Link href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <hr className="border-t border-border mx-2 -mt-px" />
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={action}>
              <SidebarMenuButton
                className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                type="submit"
              >
                <LogOut
                  className="text-muted-foreground/60"
                  size={22}
                  aria-hidden="true"
                />
                <span>Sair</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
