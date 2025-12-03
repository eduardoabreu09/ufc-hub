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
              <Image
                src={"/logo.svg"}
                height={30}
                width={30}
                alt="UFC Hub Logo"
                priority
              />
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
              <AccordionTrigger>Colabore com seus grupos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Crie e organize grupos com colegas da universidade para
                  discutir disciplinas, compartilhar materiais e acompanhar
                  atividades em equipe.
                </p>
                <p>
                  Gerencie membros, envie mensagens em tempo real e centralize
                  tudo o que o seu grupo precisa em um único espaço.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Participe de eventos</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Descubra eventos acadêmicos e culturais da UFC, confirme sua
                  presença ou marque como &quot;Talvez&quot; em segundos.
                </p>
                <p>
                  Crie seus próprios eventos, convide colegas e acompanhe quem
                  já confirmou participação para planejar melhor cada encontro.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Organize sua agenda</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  Visualize seu calendário semanal com todos os eventos e
                  compromissos acadêmicos para manter sua rotina sob controle.
                </p>
                <p>
                  Receba lembretes, veja conflitos de horário e adapte sua
                  agenda rapidamente para não perder nenhuma atividade
                  importante.
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
