"use client";

import { UserDTO } from "@/types/user";
import { createContext, ReactNode, useContext, useMemo } from "react";
import useSWR from "swr";

type SessionContext = {
  user: UserDTO | null;
};

interface SessionProviderProps {
  children: ReactNode;
}

const SessionContext = createContext<SessionContext | null>(null);

function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider.");
  }
  return context;
}

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

function SessionProvider({ children }: SessionProviderProps) {
  const { data, error, isLoading, mutate } = useSWR<UserDTO>(
    `/api/session`,
    fetcher,
    {
      refreshInterval: 60000 * 60, // 1 hour
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const contextValue = useMemo<SessionContext>(
    () => ({
      user: data ?? null,
    }),
    [data]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
}

export { SessionProvider, useSession };
