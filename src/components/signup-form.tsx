"use client";
import { signup } from "@/actions/auth";
import { useActionState } from "react";

export default function SignupForm() {
  const [state, action, isPending] = useActionState(signup, undefined);
  return (
    <form action={action} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm/6 font-medium text-foreground"
        >
          Usuário
        </label>
        <div className="mt-2">
          <input
            minLength={3}
            maxLength={32}
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            defaultValue={(state?.payload?.get("username") || "") as string}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
          {state?.errors?.username?.errors && (
            <p className=" text-red-700">{state.errors.username.errors}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm/6 font-medium text-gray-100"
        >
          Email
        </label>
        <div className="mt-2">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={(state?.payload?.get("email") || "") as string}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
          {state?.errors?.email?.errors && (
            <p className=" text-red-700">{state.errors.email.errors}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm/6 font-medium text-gray-100"
        >
          Nome
        </label>
        <div className="mt-2">
          <input
            minLength={3}
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={(state?.payload?.get("name") || "") as string}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
          {state?.errors?.name?.errors && (
            <p className=" text-red-700">{state.errors.name.errors}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="course"
          className="block text-sm/6 font-medium text-gray-100"
        >
          Curso
        </label>
        <div className="mt-2">
          <input
            id="course"
            name="course"
            type="text"
            required
            defaultValue={(state?.payload?.get("course") || "") as string}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />
          {state?.errors?.course?.errors && (
            <p className=" text-red-700">{state.errors.course.errors}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm/6 font-medium text-gray-100"
        >
          Senha
        </label>
        <div className="mt-2">
          <input
            minLength={8}
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            defaultValue={(state?.payload?.get("password") || "") as string}
            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          />

          {state?.errors?.password?.errors && (
            <ul>
              {state.errors.password.errors.map((error) => (
                <li className=" text-red-700" key={error}>
                  {error}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <button
          disabled={isPending}
          className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}
