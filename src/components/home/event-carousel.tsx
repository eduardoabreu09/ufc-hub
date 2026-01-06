"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  MapPin,
  UserRound,
  Clock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { EventHomeDTO } from "@/types/event";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { formatDateTime } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface EventGalleryProps {
  events?: EventHomeDTO[];
}

export function EventGallery({ events }: EventGalleryProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <div>
      <div className="mb-4 flex flex-col justify-between items-center md:flex-row">
        <h2 className="mb-4 text-2xl font-semibold md:text-3xl md:mb-0">
          Eventos em alta
        </h2>
        <div className="flex shrink-0 items-center justify-start gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              carouselApi?.scrollPrev();
            }}
            disabled={!canScrollPrev}
            className="disabled:pointer-events-auto"
            aria-label="Ver eventos anteriores"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="disabled:pointer-events-auto"
            aria-label="Ver próximos eventos"
          >
            <ArrowRight className="size-5" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
          className="relative w-full max-w-full"
        >
          <CarouselContent className="hide-scrollbar w-full max-w-full">
            {events?.map((event, index) => (
              <CarouselItem key={event.id} className="md:max-w-[452px] py-2">
                <Link
                  href={`/home/event/${event.id}`}
                  className="group flex flex-col h-full bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        className="text-xs uppercase tracking-wider"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-secondary-foreground mb-3">
                    <CalendarDays size={14} />
                    <span>
                      {formatDateTime(event.eventDate, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="aspect-3/2 flex overflow-clip rounded-xl mb-4">
                    <div className="flex-1">
                      {event.imageUrl ? (
                        <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                          <Image
                            fill
                            fetchPriority={index < 3 ? "high" : "auto"}
                            priority={index < 3}
                            src={event.imageUrl}
                            alt={event.title}
                            className="object-cover object-center"
                            placeholder="blur"
                            blurDataURL="/placeholder.webp"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full transition duration-300 group-hover:scale-105 justify-center items-center bg-muted gap-2">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground">
                            <CalendarDays size={24} />
                          </div>
                          <span className="text-sm font-medium">
                            Imagem indisponível
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 gap-2">
                    <h3 className="line-clamp-2 break-words text-lg font-semibold md:text-xl group-hover:underline">
                      {event.title}
                    </h3>

                    <p className="text-secondary-foreground line-clamp-2 text-sm">
                      {event.description}
                    </p>

                    <div className="flex flex-col mt-2 gap-2">
                      <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
                        <div className="flex gap-1 items-center">
                          <MapPin size={14} />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <Clock size={14} />
                          <span>{event.duration} min</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 items-center text-xs text-muted-foreground">
                          <UserRound size={14} />
                          <span>{event.createdBy.name}</span>
                        </div>
                        <div className="text-xs font-bold text-foreground">
                          {event._count?.participations || 0} participantes
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
