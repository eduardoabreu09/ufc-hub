"use client";

import {
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
import { useActionState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar1Icon,
  CalendarDays,
  Home,
  LogOut,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import ThemeSwitcher from "../theme-switcher";
import dynamic from "next/dynamic";

type Section = {
  title: string;
  url?: string;
  items?: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
};

const Sidebar = dynamic(
  () => import("@/components/ui/sidebar").then((mod) => mod.Sidebar),
  { ssr: false }
);

const navigation: Section[] = [
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
        title: "Blog",
        url: "/home/blog",
        icon: FileText,
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
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [state, action, isPending] = useActionState(logout, undefined);
  const pathname = usePathname();

  const isActive = useCallback(
    (url: string) => {
      let parsedPath = "";
      const splitPath = pathname?.split("/");
      if (splitPath.length > 3) {
        splitPath.pop();
      }
      parsedPath = splitPath.join("/");
      if (parsedPath !== "") {
        return parsedPath === url;
      }
      return pathname === url;
    },
    [pathname]
  );

  const renderSideContent = useCallback(
    (section: Section) => {
      if (section.title === "Outros") {
        return (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <ThemeSwitcher />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      }
      return (
        <SidebarGroup key={section.title}>
          <SidebarGroupLabel className="uppercase text-muted-foreground">
            {section.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {section.items?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="font-medium text-muted-foreground gap-3 h-9 rounded-md [&>svg]:size-auto data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                    isActive={isActive(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon size={22} aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      );
    },
    [isActive]
  );

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-4 p-2">
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
          </SidebarMenuItem>
        </SidebarMenu>
        <hr className="border-t border-border mx-2 -mt-px" />
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((section) => renderSideContent(section))}
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
