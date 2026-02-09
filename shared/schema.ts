import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export Auth models
export * from "./models/auth";
export * from "./models/chat"; // Chat models from AI integration

import { users } from "./models/auth";

// --- JOBS ---
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  jobType: text("job_type").notNull(), // Full-time, Part-time, etc.
  workMode: text("work_mode").notNull(), // Remote, Hybrid, On-site
  salaryRange: text("salary_range"),
  skills: text("skills").array(), // Array of required skills
  externalUrl: text("external_url"),
  postedAt: timestamp("posted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ 
  id: true, 
  postedAt: true,
  createdAt: true 
});

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

// --- RESUMES ---
export const resumes = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: text("file_name").notNull(),
  content: text("content").notNull(), // Extracted text content
  fileUrl: text("file_url"), // Path to stored file if needed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({ 
  id: true, 
  createdAt: true,
  updatedAt: true 
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;

// --- APPLICATIONS ---
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  status: text("status").notNull().default("Applied"), // Applied, Interview, Offer, Rejected
  notes: text("notes"),
  appliedAt: timestamp("applied_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({ 
  id: true, 
  appliedAt: true,
  updatedAt: true 
});

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

// --- API TYPES ---

// Job Match Score (calculated on the fly or stored in cache, for now computed)
export interface JobWithScore extends Job {
  matchScore?: number;
  matchExplanation?: string;
}

// Filter Actions for AI
export interface FilterState {
  role?: string;
  skills?: string[];
  datePosted?: string;
  jobType?: string[];
  workMode?: string[];
  location?: string;
  minMatchScore?: number;
}

export interface AiAction {
  type: "UPDATE_FILTERS" | "NAVIGATE" | "SHOW_MESSAGE";
  payload: any;
}

export interface ChatResponse {
  message: string;
  action?: AiAction;
}
