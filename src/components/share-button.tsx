"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

export function ShareButton() {
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = `${origin}${pathname}`;

  async function handleShare(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copiado.");
        return;
      }
      toast.error("Não foi possível copiar link.");
    } catch (error) {
      console.error("Failed to share", error);
      toast.error("Não foi possível copiar link.");
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-muted-foreground"
      aria-label="Compartilhar"
    >
      <Share2 className="h-4 w-4" />
      <span className="text-sm font-medium">Compartilhar</span>
    </Button>
  );
}
