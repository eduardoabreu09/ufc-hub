"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "react-day-picker/locale";
import { ptBR as dateFnsPtBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";

type DatePickerProps = {
  name: string;
  id?: string;
  placeholder?: string;
  defaultValue?: string | Date;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function DatePicker({
  name,
  id,
  placeholder = "Selecionar data",
  defaultValue,
  required,
  disabled,
  className,
}: DatePickerProps) {
  const initialDate = useMemo(() => {
    if (!defaultValue) return undefined;
    if (defaultValue instanceof Date) return defaultValue;
    const parsed = new Date(defaultValue);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }, [defaultValue]);

  const [date, setDate] = useState<Date | undefined>(initialDate);

  useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  return (
    <div className={className}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            data-empty={!date}
            className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            {date ? (
              format(date, "PPP", { locale: dateFnsPtBR })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            autoFocus
            disabled={{ before: new Date() }}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
      <input
        type="hidden"
        name={name}
        value={date ? date.toISOString() : ""}
        required={required}
      />
    </div>
  );
}
