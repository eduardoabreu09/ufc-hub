"use client";
import { Separator } from "@radix-ui/react-separator";
import UserDropdown from "./user-dropdown";
import { SidebarTrigger } from "../ui/sidebar";
import dynamic from "next/dynamic";

const AppBreadcrumb = dynamic(
  () => import("./app-breadcrumb").then((mod) => mod.AppBreadcrumb),
  { ssr: false }
);

export default function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ms-4" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumb />
      </div>
      <div className="flex gap-3 ml-auto">
        <UserDropdown />
      </div>
    </header>
  );
}
