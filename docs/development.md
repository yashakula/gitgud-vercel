# Development Workflow Guide

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Git for version control
- VSCode (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gitgud-vercel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

---

## Development Commands

### Core Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build production application
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Database Operations
```bash
npm run db:generate  # Generate new migrations from schema changes
npm run db:migrate   # Apply pending migrations to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:seed      # Run database seeding script (if available)
```

### Quality Assurance
```bash
npm run lint         # Check code style and potential errors
npm run lint:fix     # Auto-fix linting issues where possible
npm run type-check   # Verify TypeScript types without emitting
```

---

## Development Workflow

### Feature Development Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Develop with hot reload**
   ```bash
   npm run dev
   # Make changes - server automatically reloads
   ```

3. **Test your changes**
   - Manual testing in browser
   - Run type checking: `npm run type-check`
   - Run linting: `npm run lint`

4. **Database changes (if needed)**
   ```bash
   # Modify schema in src/lib/db/schema.ts
   npm run db:generate    # Generate migration
   npm run db:migrate     # Apply to local database
   npm run db:studio      # Verify changes visually
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Code Review Process

1. **Create pull request** on GitHub
2. **Code review checklist:**
   - TypeScript compilation passes
   - No linting errors
   - Database migrations are safe
   - Security considerations addressed
   - Performance implications considered

3. **Merge to main** after approval

---

## Code Style Guidelines

### TypeScript Standards
- Use strict TypeScript configuration
- Prefer interfaces over types for object shapes
- Use proper typing for all function parameters and returns
- Avoid `any` type - use `unknown` if necessary

```typescript
// Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

async function getUser(id: string): Promise<User | null> {
  // implementation
}

// Avoid
function getUser(id: any): any {
  // implementation
}
```

### React Component Standards
- Use functional components with hooks
- Prefer named exports over default exports
- Co-locate component files with their styles and tests
- Use TypeScript for props interface

```typescript
// Good
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={cn('btn', `btn-${variant}`)} 
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// Export at bottom
export { Button };
```

### File Naming Conventions
- Use kebab-case for file names: `add-problem-dialog.tsx`
- Use PascalCase for component names: `AddProblemDialog`
- Use camelCase for utility functions: `normalizeUrl`
- Use UPPER_CASE for constants: `DATABASE_URL`

### Import Organization
```typescript
// 1. External libraries
import { useState } from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. Internal utilities and types
import { db, problems } from '@/lib/db';
import { cn } from '@/lib/utils';

// 3. Components
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
```

---

## Database Development

### Schema Changes
1. **Modify schema** in `src/lib/db/schema.ts`
2. **Generate migration**
   ```bash
   npm run db:generate
   ```
3. **Review generated SQL** in `src/lib/db/migrations/`
4. **Apply migration**
   ```bash
   npm run db:migrate
   ```
5. **Verify changes** in Drizzle Studio

### Safe Migration Practices
- Never drop columns in production without a rollback plan
- Add columns as nullable first, then update to non-null if needed
- Use transactions for complex multi-step migrations
- Test migrations on production-like data

```sql
-- Safe: Add nullable column first
ALTER TABLE problems ADD COLUMN priority INTEGER;

-- Later: Update existing records
UPDATE problems SET priority = 1 WHERE priority IS NULL;

-- Finally: Make non-null if desired
ALTER TABLE problems ALTER COLUMN priority SET NOT NULL;
```

### Database Testing
- Use Drizzle Studio to inspect data changes
- Test queries with actual data volumes
- Verify foreign key constraints work correctly
- Check cascade delete behavior

---

## Component Development

### shadcn/ui Integration
- Use existing components from `src/components/ui/`
- Follow shadcn/ui patterns for new components
- Maintain accessibility features

```typescript
// Adding a new shadcn/ui component
npx shadcn-ui@latest add dropdown-menu

// Component will be added to src/components/ui/dropdown-menu.tsx
```

### Custom Component Development
```typescript
// src/components/problem-card.tsx
interface ProblemCardProps {
  problem: Problem;
  onEdit?: (problem: Problem) => void;
  onDelete?: (problem: Problem) => void;
}

export function ProblemCard({ problem, onEdit, onDelete }: ProblemCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{problem.title}</CardTitle>
        <CardDescription>{problem.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <Badge variant={problem.difficulty}>{problem.difficulty}</Badge>
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(problem)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(problem)}>
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## API Development

### Creating New Endpoints
1. **Create route file**: `src/app/api/your-endpoint/route.ts`
2. **Implement HTTP methods**:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, yourTable } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await db
      .select()
      .from(yourTable)
      .where(eq(yourTable.userId, userId));

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```

### Error Handling Patterns
- Always check authentication first
- Use try-catch blocks for database operations
- Return consistent error response format
- Log errors for debugging

### Input Validation
```typescript
// Using Zod for validation (recommended)
import { z } from 'zod';

const createProblemSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate input
  const result = createProblemSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error.errors },
      { status: 400 }
    );
  }
  
  // Use validated data
  const { title, url, difficulty } = result.data;
  // ... rest of implementation
}
```

---

## Testing Strategy

### Manual Testing
- Test all user flows in development
- Verify authentication works correctly
- Test error states and edge cases
- Validate responsive design on different screen sizes

### Database Testing
```bash
# Test with fresh database
npm run db:migrate
npm run db:studio  # Verify schema
# Manual testing of CRUD operations
```

### API Testing
Use tools like curl or Postman to test API endpoints:

```bash
# Test protected endpoint
curl -X GET http://localhost:3000/api/problems \
  -H "Cookie: __session=your_clerk_session"

# Test POST endpoint
curl -X POST http://localhost:3000/api/problems \
  -H "Content-Type: application/json" \
  -H "Cookie: __session=your_clerk_session" \
  -d '{"title":"Test Problem","url":"https://example.com","difficulty":"easy"}'
```

---

## Debugging

### Development Tools
- **React Developer Tools**: Browser extension for component debugging
- **Drizzle Studio**: Visual database browser
- **Next.js Dev Tools**: Built-in performance and debugging tools
- **Network Tab**: Monitor API requests and responses

### Common Issues and Solutions

**Database Connection Issues**
```bash
# Check environment variables
echo $DATABASE_URL

# Test database connection
npm run db:studio
```

**TypeScript Errors**
```bash
# Run type checker
npm run type-check

# Common fixes
npm install @types/package-name  # Install missing types
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Authentication Issues**
- Verify Clerk environment variables
- Check middleware configuration
- Ensure API routes use `auth()` correctly

### Logging Best Practices
```typescript
// Good: Structured logging
console.log('Creating problem', { userId, title, url });

// Good: Error logging with context
console.error('Database error creating problem', {
  error: error.message,
  userId,
  operation: 'createProblem'
});

// Avoid: Logging sensitive data
console.log('User data', { password, apiKey }); // DON'T DO THIS
```

---

## Performance Optimization

### Frontend Optimization
- Use React Server Components where possible
- Implement proper loading states
- Optimize images with Next.js Image component
- Use dynamic imports for large components

### Database Optimization
- Add indexes for frequently queried columns
- Use `limit()` for pagination
- Avoid N+1 queries with proper joins
- Monitor query performance in production

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Optimize for production
npm run build
npm run start
```

---

## Deployment Preparation

### Pre-deployment Checklist
- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] TypeScript compilation passes
- [ ] No linting errors
- [ ] Manual testing completed
- [ ] Performance testing done

### Environment Setup
```bash
# Production environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://prod_connection_string
```

### Database Migration in Production
```bash
# Apply migrations to production database
npm run db:migrate

# Verify with Drizzle Studio (use read-only connection)
npm run db:studio
```

---

## Troubleshooting Guide

### Development Server Issues
```bash
# Server won't start
rm -rf .next node_modules
npm install
npm run dev

# Port already in use
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Database Issues
```bash
# Migration fails
npm run db:studio  # Check current state
# Fix schema issues manually if needed
npm run db:generate
npm run db:migrate
```

### Authentication Issues
- Verify Clerk webhook endpoints
- Check environment variable formatting
- Ensure middleware is properly configured

### Build Issues
```bash
# Type errors
npm run type-check

# Dependency issues
npm audit fix
npm update

# Cache issues
rm -rf .next
npm run build
```