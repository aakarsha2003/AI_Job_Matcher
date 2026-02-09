import { useQuery, useMutation } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  workMode?: string;
  skills?: string;
  minMatchScore?: number;
}

export function useJobs(filters?: JobFilters) {
  // Construct query string for caching key and fetch
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, String(value));
    });
  }
  const queryString = queryParams.toString();
  const path = `${api.jobs.list.path}?${queryString}`;

  return useQuery({
    queryKey: [api.jobs.list.path, filters],
    queryFn: async () => {
      const res = await fetch(path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return api.jobs.list.responses[200].parse(await res.json());
    },
  });
}

export function useJob(id: number) {
  return useQuery({
    queryKey: [api.jobs.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.jobs.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch job");
      return api.jobs.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useMatchJob() {
  return useMutation({
    mutationFn: async (resumeText: string) => {
      const res = await fetch(api.jobs.match.path, {
        method: api.jobs.match.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to match jobs");
      return api.jobs.match.responses[200].parse(await res.json());
    },
  });
}
