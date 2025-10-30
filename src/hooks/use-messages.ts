import { MessageDTO } from "@/types/message";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function useMessages(groupId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/group/${groupId}/messages`,
    fetcher,
    {
      refreshInterval: 3600,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    messages: data as MessageDTO[] | undefined,
    isLoading,
    isError: error,
    mutate,
  };
}
