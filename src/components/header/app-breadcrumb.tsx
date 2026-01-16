"use client";

import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const title = useMemo(() => {
    if (pathname.includes("group")) {
      return "Grupos";
    }
    if (pathname.includes("event")) {
      return "Eventos";
    }
    if (pathname.includes("blog")) {
      return "Blog";
    }
    if (pathname.includes("profile")) {
      return "Perfil";
    }
    if (pathname.includes("calendar")) {
      return "Calendário";
    }
    return "";
  }, [pathname]);

  const routes = useMemo(() => {
    if (pathname.split("/").length > 3) {
      return pathname.split("/").slice(2, -1);
    }
    return pathname.split("/").slice(2);
  }, [pathname]);

  if (isMobile === undefined) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {isMobile && (
          <BreadcrumbItem>
            <BreadcrumbLink href="/home" aria-label="Ir para Home">
              <Home
                className="text-muted-foreground"
                size={22}
                aria-hidden="true"
              />
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {!isMobile && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {routes.length > 0 && <BreadcrumbSeparator />}
            {routes.map((route, index) => (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink href={`/home/${route}`}>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
