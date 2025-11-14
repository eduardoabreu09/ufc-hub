"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { Participation } from "@prisma/client";
import { RiQuestionMark } from "@remixicon/react";
import { ComponentType, ReactElement } from "react";
import { toast } from "sonner";
import { participateInEvent } from "@/features/events/actions/participate-in-event";
import { cn } from "@/lib/utils";

interface ParticipateDialogProps {
  eventId: number;
  type: Participation;
  selected?: Participation;
}

type ParticipationConfig = {
  label: string;
  description: string;
  className: string;
  Icon: ComponentType<{ className?: string; "aria-label"?: string }>;
  iconLabel: string;
  selectedClassName: string;
};

const PARTICIPATION_CONFIG: Record<Participation, ParticipationConfig> = {
  YES: {
    label: "Confirmar participação",
    description: "Tem certeza que deseja confirmar sua participação no evento?",
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
    Icon: Check,
    iconLabel: "Confirmar presença",
    selectedClassName:
      "ring-2 ring-offset-2 ring-offset-background ring-emerald-300 shadow-md shadow-emerald-600/20",
  },
  NO: {
    label: "Recusar participação",
    description: "Tem certeza que deseja recusar sua participação no evento?",
    className: "bg-red-800 text-white hover:bg-red-900",
    Icon: X,
    iconLabel: "Não participar",
    selectedClassName:
      "ring-2 ring-offset-2 ring-offset-background ring-red-400 shadow-md shadow-red-900/20",
  },
  MAYBE: {
    label: "Participação incerta",
    description:
      "Tem certeza que deseja marcar sua participação como 'Talvez' no evento?",
    className: "bg-amber-500 text-white hover:bg-amber-600",
    Icon: RiQuestionMark,
    iconLabel: "Talvez participar",
    selectedClassName:
      "ring-2 ring-offset-2 ring-offset-background ring-amber-300 shadow-md shadow-amber-600/20",
  },
};

export default function ParticipateDialog({
  eventId,
  type,
  selected,
}: ParticipateDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const config = PARTICIPATION_CONFIG[type];
  const TriggerIcon = config.Icon;
  const isSelected = selected === type;

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await participateInEvent(eventId, type);
      if (result.isSuccess) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
    setOpen(false);
  };

  const renderTriggerButton = (): ReactElement => (
    <Button
      type="button"
      className={cn(
        config.className,
        selected && selected !== type && "opacity-60",
        isSelected && config.selectedClassName
      )}
      aria-label={config.iconLabel}
      aria-pressed={isSelected}
      data-selected={isSelected ? "true" : undefined}
      disabled={isPending}
    >
      <TriggerIcon className="h-4 w-4" aria-hidden="true" />
      {isSelected && <span className="sr-only">Opção selecionada</span>}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{renderTriggerButton()}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{config.label}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Não
          </Button>
          <Button
            type="button"
            className={config.className}
            onClick={handleConfirm}
          >
            Sim
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
