import { z } from 'zod';
import { insertJobSchema, insertApplicationSchema, insertResumeSchema, jobs, applications, resumes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs' as const,
      input: z.object({
        search: z.string().optional(),
        skills: z.string().optional(), // Comma separated
        location: z.string().optional(),
        type: z.string().optional(),
        workMode: z.string().optional(),
        minMatchScore: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<any>()), // Returns JobWithScore
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id' as const,
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    match: {
      method: 'POST' as const,
      path: '/api/jobs/match' as const,
      input: z.object({
        resumeText: z.string(),
      }),
      responses: {
        200: z.array(z.object({
          jobId: z.number(),
          score: z.number(),
          explanation: z.string(),
        })),
      },
    },
  },
  applications: {
    list: {
      method: 'GET' as const,
      path: '/api/applications' as const,
      responses: {
        200: z.array(z.custom<typeof applications.$inferSelect & { job: typeof jobs.$inferSelect }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/applications' as const,
      input: insertApplicationSchema,
      responses: {
        201: z.custom<typeof applications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/applications/:id/status' as const,
      input: z.object({
        status: z.enum(["Applied", "Interview", "Offer", "Rejected"]),
      }),
      responses: {
        200: z.custom<typeof applications.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  resumes: {
    upload: {
      method: 'POST' as const,
      path: '/api/resumes' as const,
      // Input is FormData, handled manually
      responses: {
        201: z.custom<typeof resumes.$inferSelect>(),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/resumes/current' as const,
      responses: {
        200: z.custom<typeof resumes.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  ai: {
    chat: {
      method: 'POST' as const,
      path: '/api/ai/chat' as const,
      input: z.object({
        message: z.string(),
        currentFilters: z.any().optional(), // Pass current state to AI
      }),
      responses: {
        200: z.object({
          message: z.string(),
          action: z.object({
            type: z.enum(["UPDATE_FILTERS", "NAVIGATE", "SHOW_MESSAGE"]),
            payload: z.any(),
          }).optional(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
