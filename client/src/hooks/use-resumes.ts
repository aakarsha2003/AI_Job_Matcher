import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCurrentResume() {
  return useQuery({
    queryKey: [api.resumes.get.path],
    queryFn: async () => {
      const res = await fetch(api.resumes.get.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch resume");
      return api.resumes.get.responses[200].parse(await res.json());
    },
  });
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch(api.resumes.upload.path, {
        method: api.resumes.upload.method,
        body: formData,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to upload resume");
      return api.resumes.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.resumes.get.path] });
      // Invalidate jobs to trigger re-matching logic if we had it
      queryClient.invalidateQueries({ queryKey: [api.jobs.list.path] });
    },
  });
}
