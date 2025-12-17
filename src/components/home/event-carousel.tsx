"use client";

import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { EventDTO } from "@/types/event";
import Link from "next/link";

interface EventGalleryProps {
  events?: EventDTO[];
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
            {events?.map((event) => (
              <CarouselItem key={event.id} className="md:max-w-[452px]">
                <Link
                  href={`/home/event/${event.id}`}
                  className="group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-3/2 flex overflow-clip rounded-xl">
                      <div className="flex-1">
                        {event.imageUrl ? (
                          <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                            <img
                              src={event.imageUrl}
                              alt={event.title}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                        ) : (
                          <div className="flex h-full w-full transition duration-300 group-hover:scale-105 justify-center items-center bg-muted gap-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/10">
                              <CalendarDays size={24} />
                            </div>
                            <span className="text-sm font-medium">
                              Imagem indisponível
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                    {event.title}
                  </div>
                  <div className="text-muted-foreground mb-8 line-clamp-2 text-sm md:mb-12 md:text-base lg:mb-9">
                    {event.description}
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
