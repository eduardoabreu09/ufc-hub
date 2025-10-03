import { GroupMessage } from "@/types/group";
import useSWR from "swr";

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function useMessages(groupId: number) {
  const { data, error, isLoading } = useSWR(
    `/api/group/${groupId}/messages`,
    fetcher,
    { refreshInterval: 1000 }
  );

  return {
    messages: data as GroupMessage[] | undefined,
    isLoading,
    isError: error,
  };
}
