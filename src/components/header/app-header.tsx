import { Separator } from "@radix-ui/react-separator";
import { AppBreadcrumb } from "./app-breadcrumb";
import UserDropdown from "./user-dropdown";
import { Suspense } from "react";

export default function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Suspense>
          <AppBreadcrumb />
        </Suspense>
      </div>
      <div className="flex gap-3 ml-auto">
        <UserDropdown />
      </div>
    </header>
  );
}
