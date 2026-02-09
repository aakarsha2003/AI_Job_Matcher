import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAiChat() {
  return useMutation({
    mutationFn: async ({ message, currentFilters }: { message: string; currentFilters?: any }) => {
      const res = await fetch(api.ai.chat.path, {
        method: api.ai.chat.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, currentFilters }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.ai.chat.responses[200].parse(await res.json());
    },
  });
}
