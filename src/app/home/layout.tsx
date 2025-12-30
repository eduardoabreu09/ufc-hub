import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SessionProvider } from "@/context/session-context";
import AppHeader from "@/components/header/app-header";
import { Suspense } from "react";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <SidebarProvider>
        <Suspense fallback={null}>
          <AppSidebar />
        </Suspense>
        <SidebarInset className="overflow-hidden px-4 md:px-6 lg:px-8">
          <AppHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
