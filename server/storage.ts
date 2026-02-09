import { db } from "./db";
import { 
  users, jobs, applications, resumes,
  type User, type InsertUser,
  type Job, type InsertJob,
  type Application, type InsertApplication,
  type Resume, type InsertResume,
  type JobWithScore
} from "@shared/schema";
import { eq, desc, and, ilike, or, arrayContains, gte, sql } from "drizzle-orm";

export interface IStorage {
  // Users (from Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Jobs
  getJobs(filters?: any): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  seedJobs(): Promise<void>;

  // Applications
  getApplications(userId: string): Promise<(Application & { job: Job })[]>;
  createApplication(app: InsertApplication): Promise<Application>;
  updateApplicationStatus(id: number, status: string): Promise<Application>;

  // Resumes
  getResume(userId: string): Promise<Resume | undefined>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, content: string): Promise<Resume>;
}

export class DatabaseStorage implements IStorage {
  // --- USERS ---
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Replit auth uses email/id, this might not be used directly but keeping for compatibility
    // In replit auth schema, there is no username column, only email. 
    // We'll search by email if needed, or return undefined.
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // This is handled by Replit Auth usually, but implementing for completeness
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // --- JOBS ---
  async getJobs(filters: any = {}): Promise<Job[]> {
    let conditions = [];

    if (filters.search) {
      conditions.push(or(
        ilike(jobs.title, `%${filters.search}%`),
        ilike(jobs.description, `%${filters.search}%`),
        ilike(jobs.company, `%${filters.search}%`)
      ));
    }

    if (filters.location) {
      conditions.push(ilike(jobs.location, `%${filters.location}%`));
    }

    if (filters.type) {
       conditions.push(eq(jobs.jobType, filters.type));
    }
    
    if (filters.workMode) {
      conditions.push(eq(jobs.workMode, filters.workMode));
    }

    // Note: Simple filtering for now. Complex AI filtering will be done by converting NL to these params.
    
    return await db.select()
      .from(jobs)
      .where(and(...conditions))
      .orderBy(desc(jobs.postedAt));
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async createJob(job: InsertJob): Promise<Job> {
    const [newJob] = await db.insert(jobs).values(job).returning();
    return newJob;
  }

  async seedJobs(): Promise<void> {
    const count = await db.select({ count: sql<number>`count(*)` }).from(jobs);
    if (Number(count[0].count) === 0) {
      const seedData: InsertJob[] = [
        {
          title: "Frontend Developer",
          company: "TechCorp",
          location: "San Francisco, CA",
          description: "We are looking for a skilled React developer with experience in TypeScript and Tailwind CSS.",
          jobType: "Full-time",
          workMode: "Hybrid",
          salaryRange: "$120k - $150k",
          skills: ["React", "TypeScript", "Tailwind", "Frontend"],
          externalUrl: "https://example.com/jobs/1"
        },
        {
          title: "Backend Engineer",
          company: "DataSystems",
          location: "New York, NY",
          description: "Join our team to build scalable APIs using Node.js and PostgreSQL.",
          jobType: "Full-time",
          workMode: "On-site",
          salaryRange: "$130k - $160k",
          skills: ["Node.js", "PostgreSQL", "API", "Backend"],
          externalUrl: "https://example.com/jobs/2"
        },
        {
          title: "Full Stack Developer",
          company: "StartupInc",
          location: "Remote",
          description: "Looking for a generalist who can handle both frontend and backend tasks. React + Node.js stack.",
          jobType: "Contract",
          workMode: "Remote",
          salaryRange: "$80/hr",
          skills: ["React", "Node.js", "Full Stack", "JavaScript"],
          externalUrl: "https://example.com/jobs/3"
        },
        {
          title: "AI Engineer",
          company: "FutureAI",
          location: "Austin, TX",
          description: "Build the next generation of AI models using Python, PyTorch, and LangChain.",
          jobType: "Full-time",
          workMode: "Remote",
          salaryRange: "$160k - $200k",
          skills: ["Python", "AI", "LangChain", "PyTorch"],
          externalUrl: "https://example.com/jobs/4"
        },
        {
          title: "Product Designer",
          company: "CreativeStudio",
          location: "Los Angeles, CA",
          description: "Design beautiful and intuitive user interfaces. Figma expertise required.",
          jobType: "Part-time",
          workMode: "Hybrid",
          salaryRange: "$60k - $80k",
          skills: ["Design", "Figma", "UI/UX"],
          externalUrl: "https://example.com/jobs/5"
        }
      ];
      await db.insert(jobs).values(seedData);
    }
  }

  // --- APPLICATIONS ---
  async getApplications(userId: string): Promise<(Application & { job: Job })[]> {
    const result = await db.select()
      .from(applications)
      .innerJoin(jobs, eq(applications.jobId, jobs.id))
      .where(eq(applications.userId, userId))
      .orderBy(desc(applications.appliedAt));
    
    return result.map(row => ({
      ...row.applications,
      job: row.jobs
    }));
  }

  async createApplication(app: InsertApplication): Promise<Application> {
    const [newApp] = await db.insert(applications).values(app).returning();
    return newApp;
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application> {
    const [updated] = await db.update(applications)
      .set({ status, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return updated;
  }

  // --- RESUMES ---
  async getResume(userId: string): Promise<Resume | undefined> {
    const [resume] = await db.select()
      .from(resumes)
      .where(eq(resumes.userId, userId))
      .orderBy(desc(resumes.createdAt))
      .limit(1);
    return resume;
  }

  async createResume(resume: InsertResume): Promise<Resume> {
    const [newResume] = await db.insert(resumes).values(resume).returning();
    return newResume;
  }

  async updateResume(id: number, content: string): Promise<Resume> {
    const [updated] = await db.update(resumes)
      .set({ content, updatedAt: new Date() })
      .where(eq(resumes.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
