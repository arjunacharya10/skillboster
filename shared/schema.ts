import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Fields of work and hobbies available for challenges
export const workFields = [
  // Professional Fields
  "software-development",
  "data-science",
  "design",
  "marketing",
  "content-creation",
  "business",
  "finance",
  "education",
  "healthcare",
  "project-management",
  
  // Arts & Creativity
  "writing",
  "visual-art",
  "music",
  "photography",
  "filmmaking",
  
  // Crafts & Making
  "crafts",
  "woodworking",
  "cooking",
  "gardening",
  "home-diy",
  
  // Personal Development
  "language-learning",
  "fitness",
  "meditation",
  "volunteering",
  "public-speaking"
] as const;

export const expertiseLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "expert"
] as const;

// Challenge schema
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  field: text("field").notNull(),
  expertiseLevel: text("expertise_level").notNull(),
  timeHours: integer("time_hours").notNull().default(0),
  timeMinutes: integer("time_minutes").notNull().default(0),
  requirements: json("requirements").notNull().$type<string[]>(),
  resources: json("resources").notNull().$type<{title: string, url: string}[]>(),
  tags: json("tags").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

// User saved challenges
export const savedChallenges = pgTable("saved_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSavedChallengeSchema = createInsertSchema(savedChallenges).omit({
  id: true,
  createdAt: true,
});

export type InsertSavedChallenge = z.infer<typeof insertSavedChallengeSchema>;
export type SavedChallenge = typeof savedChallenges.$inferSelect;

// Challenge generation request schema
export const challengeRequestSchema = z.object({
  field: z.enum(workFields),
  expertiseLevel: z.enum(expertiseLevels),
  timeHours: z.number().min(0).max(24),
  timeMinutes: z.number().min(0).max(59),
  focusArea: z.string().optional(),
  count: z.number().min(1).max(5).default(3),
});

export type ChallengeRequest = z.infer<typeof challengeRequestSchema>;
