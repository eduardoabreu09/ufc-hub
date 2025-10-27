"use client";

import { signup } from "@/features/session/actions/signup";
import { useActionState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, University } from "lucide-react";
import { toast } from "sonner";
import { redirect } from "next/navigation";

export default function SignupForm() {
  const [state, action, isPending] = useActionState(signup, undefined);

  const previousStateRef = useRef(state);

  useEffect(() => {
    if (state?.isSuccess && state !== previousStateRef.current) {
      toast.success(state.message);
      redirect("/home");
    }
    if (
      !state?.isSuccess &&
      state !== previousStateRef.current &&
      state?.message
    ) {
      toast.error(state.message);
    }
    previousStateRef.current = state;
  }, [state]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className=" flex-row items-center justify-center">
          <div className="flex justify-center items-center mb-2">
            <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-md">
              <University className="size-12" />
            </div>
          </div>
          <CardTitle className=" text-2xl">Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6 ">
              <div className="grid gap-3">
                <Label htmlFor="name">
                  Nome <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  minLength={3}
                  required
                  autoComplete="name"
                  placeholder="Nome"
                  defaultValue={(state?.payload?.get("name") || "") as string}
                />
                {state?.errors?.name && (
                  <p className=" text-destructive">{state.errors.name}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="course">Curso</Label>
                <Input
                  id="course"
                  name="course"
                  type="text"
                  autoComplete="course"
                  placeholder="Curso"
                  defaultValue={(state?.payload?.get("course") || "") as string}
                />
                {state?.errors?.course && (
                  <p className=" text-destructive">{state.errors.course}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  defaultValue={(state?.payload?.get("email") || "") as string}
                />
                {state?.errors?.email && (
                  <p className=" text-destructive">{state.errors.email}</p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">
                  Senha <span className="text-destructive">*</span>
                </Label>
                <Input
                  minLength={8}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Senha"
                />
                {state?.errors?.password && (
                  <ul>
                    {state.errors.password.map((error) => (
                      <li className=" text-destructive" key={error}>
                        {error}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {isPending && (
                  <Button type="submit" className="w-full" disabled>
                    <Loader2 className=" animate-spin" /> Criando...
                  </Button>
                )}
                {!isPending && (
                  <Button type="submit" className="w-full">
                    Criar conta
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?{" "}
              <a href="/login" className="underline underline-offset-4">
                Entrar
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
