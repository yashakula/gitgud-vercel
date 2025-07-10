import { pgTable, text, timestamp, uuid, pgEnum, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);
export const statusEnum = pgEnum('status', ['solved', 'partial', 'failed']);

// Users table (managed by Clerk)
export const users = pgTable('users', {
  clerkId: text('clerk_id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Problems table
export const problems = pgTable('problems', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.clerkId, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  platform: text('platform'), // 'leetcode', 'hackerrank', 'codewars', etc.
  difficulty: difficultyEnum('difficulty').notNull(),
  tags: text('tags').array(), // Array of strings for tags
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Attempts table
export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id')
    .notNull()
    .references(() => problems.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.clerkId, { onDelete: 'cascade' }),
  status: statusEnum('status').notNull(),
  timeTaken: integer('time_taken'), // in minutes
  notes: text('notes'),
  solutionCode: text('solution_code'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  problems: many(problems),
  attempts: many(attempts),
}));

export const problemsRelations = relations(problems, ({ one, many }) => ({
  user: one(users, {
    fields: [problems.userId],
    references: [users.clerkId],
  }),
  attempts: many(attempts),
}));

export const attemptsRelations = relations(attempts, ({ one }) => ({
  problem: one(problems, {
    fields: [attempts.problemId],
    references: [problems.id],
  }),
  user: one(users, {
    fields: [attempts.userId],
    references: [users.clerkId],
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;