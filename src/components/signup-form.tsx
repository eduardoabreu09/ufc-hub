"use client";

import { signup } from "@/features/session/actions/signup";
import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function SignupForm() {
  const [state, action, isPending] = useActionState(signup, undefined);
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className=" flex-row items-center justify-center">
          <CardTitle className=" text-2xl">Crie sua conta</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Nome*</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  minLength={3}
                  required
                  autoComplete="name"
                  defaultValue={(state?.payload?.get("name") || "") as string}
                />
                {state?.errors?.name?.errors && (
                  <p className=" text-destructive">
                    {state.errors.name.errors}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="course">Curso*</Label>
                <Input
                  id="course"
                  name="course"
                  type="text"
                  required
                  autoComplete="course"
                  defaultValue={(state?.payload?.get("course") || "") as string}
                />
                {state?.errors?.course?.errors && (
                  <p className=" text-destructive">
                    {state.errors.course.errors}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  defaultValue={(state?.payload?.get("email") || "") as string}
                />
                {state?.errors?.email?.errors && (
                  <p className=" text-destructive">
                    {state.errors.email.errors}
                  </p>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Senha*</Label>
                <Input
                  minLength={8}
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                />
                {state?.errors?.password?.errors && (
                  <ul>
                    {state.errors.password.errors.map((error) => (
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
