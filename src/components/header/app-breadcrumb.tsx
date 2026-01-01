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
import { useEffect, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppBreadcrumb() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [clientPathname, setClientPathname] = useState("");

  useEffect(() => {
    setClientPathname(pathname);
  }, [pathname]);

  const title = useMemo(() => {
    if (clientPathname.includes("group")) {
      return "Grupos";
    }
    if (clientPathname.includes("event")) {
      return "Eventos";
    }
    if (clientPathname.includes("blog")) {
      return "Blog";
    }
    return "";
  }, [clientPathname]);

  const routes = useMemo(() => {
    if (clientPathname.split("/").length > 3) {
      return clientPathname.split("/").slice(2, -1);
    }
    return clientPathname.split("/").slice(2);
  }, [clientPathname]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {isMobile && (
          <BreadcrumbItem>
            <BreadcrumbLink href="/home" aria-label="Ir para Home">
              <Home size={22} aria-hidden="true" />
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
