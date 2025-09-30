import { GalleryVerticalEnd } from "lucide-react";

import LoginForm from "@/components/login-form";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            UFC Hub
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <div className="flex w-full h-full absolute z-10 bg-black/70 backdrop-blur-md justify-center">
          <Accordion
            type="single"
            collapsible
            className="w-md p-6 text-primary-foreground"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Product Information</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Our flagship product combines cutting-edge technology with
                  sleek design. Built with premium materials, it offers
                  unparalleled performance and reliability.
                </p>
                <p>
                  Key features include advanced processing capabilities, and an
                  intuitive user interface designed for both beginners and
                  experts.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Shipping Details</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We offer worldwide shipping through trusted courier partners.
                  Standard delivery takes 3-5 business days, while express
                  shipping ensures delivery within 1-2 business days.
                </p>
                <p>
                  All orders are carefully packaged and fully insured. Track
                  your shipment in real-time through our dedicated tracking
                  portal.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Return Policy</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  We stand behind our products with a comprehensive 30-day
                  return policy. If you&apos;re not completely satisfied, simply
                  return the item in its original condition.
                </p>
                <p>
                  Our hassle-free return process includes free return shipping
                  and full refunds processed within 48 hours of receiving the
                  returned item.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/portrait.png"
          alt="UFC Campus do Pici"
          fill={true}
          priority={true}
        />
      </div>
    </div>
  );
}
