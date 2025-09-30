"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/features/session/actions/login";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, action, isPending] = useActionState(login, undefined);
  return (
    <form className={"flex flex-col gap-6"} action={action}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entre na sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Insira suas credenciais para acessar sua conta.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="usuario@ufc.br"
            autoComplete="email"
            required
            defaultValue={(state?.payload?.get("email") || "") as string}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete="current-password"
          />
        </div>
        {state?.message && <p className=" text-destructive">{state.message}</p>}
        {isPending && (
          <Button type="submit" className="w-full" disabled>
            <Loader2 className=" animate-spin" /> Entrando...
          </Button>
        )}
        {!isPending && (
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        )}
      </div>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <a href="/signup" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
