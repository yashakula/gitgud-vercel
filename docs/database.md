# Database Documentation

## Overview

GitGud uses a PostgreSQL database hosted on Neon with Drizzle ORM for type-safe database operations. The schema is designed to track coding problems and practice attempts for authenticated users.

## Database Configuration

### Connection Setup
```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });
```

### Environment Variables
```bash
DATABASE_URL=postgresql://username:password@hostname/database
```

---

## Schema Overview

The database consists of three main tables with the following relationships:

```
users (Clerk sync)
  ↓ (1:many)
problems (User content)
  ↓ (1:many)  
attempts (Practice records)
```

---

## Table Definitions

### Users Table
Synchronizes Clerk user data with the local database.

```sql
CREATE TABLE users (
  clerk_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

**TypeScript Schema**
```typescript
export const users = pgTable('users', {
  clerkId: text('clerk_id').primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Fields**
- `clerk_id`: Clerk's unique user identifier (Primary Key)
- `email`: User's email address
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

### Problems Table
Stores coding problems added by users.

```sql
CREATE TABLE problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  platform TEXT,
  difficulty difficulty_enum NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TYPE difficulty_enum AS ENUM ('easy', 'medium', 'hard');
```

**TypeScript Schema**
```typescript
export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

export const problems = pgTable('problems', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.clerkId, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  platform: text('platform'),
  difficulty: difficultyEnum('difficulty').notNull(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Fields**
- `id`: UUID primary key (auto-generated)
- `user_id`: Foreign key to `users.clerk_id` (CASCADE DELETE)
- `title`: Problem title (required)
- `description`: Detailed problem description (optional)
- `url`: Source URL for the problem (optional)
- `platform`: Platform name (e.g., "leetcode", "hackerrank") (optional)
- `difficulty`: Problem difficulty level (required)
- `tags`: Array of tag strings for categorization (optional)
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

### Attempts Table
Records practice attempts at solving problems.

```sql
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  status status_enum NOT NULL,
  time_taken INTEGER,
  notes TEXT,
  solution_code TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TYPE status_enum AS ENUM ('solved', 'partial', 'failed');
```

**TypeScript Schema**
```typescript
export const statusEnum = pgEnum('status', ['solved', 'partial', 'failed']);

export const attempts = pgTable('attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id')
    .notNull()
    .references(() => problems.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.clerkId, { onDelete: 'cascade' }),
  status: statusEnum('status').notNull(),
  timeTaken: integer('time_taken'),
  notes: text('notes'),
  solutionCode: text('solution_code'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

**Fields**
- `id`: UUID primary key (auto-generated)
- `problem_id`: Foreign key to `problems.id` (CASCADE DELETE)
- `user_id`: Foreign key to `users.clerk_id` (CASCADE DELETE)
- `status`: Attempt outcome (required)
- `time_taken`: Duration in minutes (optional)
- `notes`: User notes about the attempt (optional)
- `solution_code`: Code solution (optional)
- `created_at`: Record creation timestamp
- `updated_at`: Last modification timestamp

---

## Relationships

### Foreign Key Constraints
```sql
-- Problems belong to users
ALTER TABLE problems 
ADD CONSTRAINT problems_user_id_users_clerk_id_fk 
FOREIGN KEY (user_id) REFERENCES users(clerk_id) ON DELETE CASCADE;

-- Attempts belong to problems and users
ALTER TABLE attempts 
ADD CONSTRAINT attempts_problem_id_problems_id_fk 
FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE;

ALTER TABLE attempts 
ADD CONSTRAINT attempts_user_id_users_clerk_id_fk 
FOREIGN KEY (user_id) REFERENCES users(clerk_id) ON DELETE CASCADE;
```

### Drizzle Relations
```typescript
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
```

---

## Data Types

### TypeScript Types
```typescript
// Inferred types from schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
export type NewAttempt = typeof attempts.$inferInsert;

// Enum types
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Status = 'solved' | 'partial' | 'failed';
```

### Example Data
```typescript
// User record
const user: User = {
  clerkId: "user_2xyz123",
  email: "john@example.com",
  createdAt: new Date(),
  updatedAt: new Date()
};

// Problem record
const problem: Problem = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  userId: "user_2xyz123",
  title: "Two Sum",
  description: "Given an array of integers...",
  url: "https://leetcode.com/problems/two-sum",
  platform: "leetcode",
  difficulty: "easy",
  tags: ["array", "hash-table"],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Attempt record
const attempt: Attempt = {
  id: "456e7890-e89b-12d3-a456-426614174001",
  problemId: "123e4567-e89b-12d3-a456-426614174000",
  userId: "user_2xyz123",
  status: "solved",
  timeTaken: 45,
  notes: "Used hash map approach",
  solutionCode: "def twoSum(nums, target):\n    ...",
  createdAt: new Date(),
  updatedAt: new Date()
};
```

---

## Query Patterns

### Common Queries

**Get user's problems**
```typescript
const userProblems = await db
  .select()
  .from(problems)
  .where(eq(problems.userId, userId))
  .orderBy(desc(problems.createdAt));
```

**Get problem with attempts**
```typescript
const problemWithAttempts = await db
  .select()
  .from(problems)
  .leftJoin(attempts, eq(attempts.problemId, problems.id))
  .where(and(
    eq(problems.id, problemId),
    eq(problems.userId, userId)
  ));
```

**Create problem with user validation**
```typescript
// Ensure user exists
const existingUser = await db
  .select()
  .from(users)
  .where(eq(users.clerkId, userId))
  .limit(1);

if (existingUser.length === 0) {
  await db.insert(users).values({
    clerkId: userId,
    email: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

// Create problem
const [newProblem] = await db
  .insert(problems)
  .values({
    userId,
    title: "Problem Title",
    difficulty: "medium",
    // ... other fields
  })
  .returning();
```

**Get user statistics**
```typescript
const stats = await db
  .select({
    totalProblems: count(problems.id),
    solvedCount: count(
      sql`CASE WHEN ${attempts.status} = 'solved' THEN 1 END`
    ),
  })
  .from(problems)
  .leftJoin(attempts, eq(attempts.problemId, problems.id))
  .where(eq(problems.userId, userId))
  .groupBy(problems.userId);
```

---

## Migration Management

### Generating Migrations
```bash
npm run db:generate
```

### Applying Migrations
```bash
npm run db:migrate
```

### Migration Files
Migrations are stored in `src/lib/db/migrations/` and managed by Drizzle Kit.

**Example Migration**
```sql
-- Migration: 0000_loose_shaman.sql
CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');
CREATE TYPE "public"."status" AS ENUM('solved', 'partial', 'failed');

CREATE TABLE IF NOT EXISTS "attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"problem_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"status" "status" NOT NULL,
	"time_taken" integer,
	"notes" text,
	"solution_code" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- ... other tables and constraints
```

---

## Database Administration

### Drizzle Studio
Access the visual database browser:
```bash
npm run db:studio
```

### Direct Database Access
Connect to Neon database directly using the connection string:
```bash
psql "postgresql://username:password@hostname/database"
```

### Backup Strategy
Neon provides automatic backups. For additional backup:
```bash
pg_dump "postgresql://username:password@hostname/database" > backup.sql
```

---

## Performance Considerations

### Indexes
The following indexes are automatically created:
- Primary key indexes on all `id` fields
- Foreign key indexes on `user_id` and `problem_id` fields

### Query Optimization
- Always filter by `userId` for data isolation
- Use `limit()` for pagination
- Consider adding composite indexes for complex queries

### Connection Management
- Neon handles connection pooling automatically
- Use serverless HTTP connections via `@neondatabase/serverless`
- Connections are stateless and short-lived

### Monitoring
- Monitor query performance in Neon console
- Use Drizzle Studio for query analysis
- Consider adding query logging for debugging

---

## Security Considerations

### Data Isolation
- All queries must filter by authenticated `userId`
- Foreign key constraints enforce referential integrity
- Cascade deletes ensure data consistency

### Input Validation
- Drizzle ORM prevents SQL injection
- Validate all input data before database operations
- Use TypeScript types for compile-time safety

### Access Control
- Database credentials stored in environment variables
- No direct database access from client-side code
- All database operations go through authenticated API routes