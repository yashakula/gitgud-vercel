# Architecture Documentation

## Overview

GitGud follows a modern serverless architecture pattern using Next.js App Router, providing a clean separation between frontend, API, and data layers. The application is designed for scalability, type safety, and developer experience.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│                 │    │                 │    │                 │
│ • Next.js 15    │◄──►│ • API Routes    │◄──►│ • Neon          │
│ • React 19      │    │ • Clerk Auth    │    │ • PostgreSQL    │
│ • Tailwind CSS  │    │ • Drizzle ORM   │    │ • Migrations    │
│ • shadcn/ui     │    │ • Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Core Technologies

### Frontend Layer
- **Next.js 15 with App Router**: Modern React framework with file-based routing
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first styling approach
- **shadcn/ui**: Component library built on Radix UI primitives

### Backend Layer
- **Next.js API Routes**: Serverless functions for business logic
- **Clerk Authentication**: Complete auth solution with middleware
- **Drizzle ORM**: Type-safe database operations
- **Zod Validation**: Runtime type checking (if implemented)

### Data Layer
- **Neon PostgreSQL**: Serverless database with auto-scaling
- **Drizzle Kit**: Migration management and schema generation
- **Connection Pooling**: Handled by Neon's serverless architecture

## Authentication Architecture

### Clerk Integration Flow

```
User Request
     ↓
clerkMiddleware() ← Validates session, sets context
     ↓
API Route ← auth() extracts userId
     ↓
Database Query ← Filtered by userId
     ↓
Response
```

### Security Model
- **Session-based Authentication**: Clerk manages JWT tokens
- **Middleware Protection**: All routes protected by default
- **Data Isolation**: Users only access their own data
- **Auto-sync**: Database users created from Clerk sessions

## Database Architecture

### Schema Design

```sql
users (Clerk sync)
├── clerk_id (PK)
├── email
└── timestamps

problems (User content)
├── id (PK)
├── user_id (FK → users.clerk_id)
├── title, description, url
├── platform, difficulty, tags
└── timestamps

attempts (Activity tracking)
├── id (PK)
├── problem_id (FK → problems.id)
├── user_id (FK → users.clerk_id)
├── status, time_taken, notes
└── timestamps
```

### Relationship Patterns
- **One-to-Many**: User → Problems, User → Attempts, Problem → Attempts
- **Cascade Deletion**: User deletion removes all associated data
- **Foreign Key Constraints**: Enforce referential integrity

## API Design

### RESTful Endpoints

```
GET    /api/problems           # List user's problems
POST   /api/problems           # Create new problem
GET    /api/problems/[id]      # Get specific problem
PUT    /api/problems/[id]      # Update problem
DELETE /api/problems/[id]      # Delete problem

GET    /api/problems/[id]/attempts     # List attempts for problem
POST   /api/problems/[id]/attempts     # Create new attempt
GET    /api/problems/[id]/attempts/[attemptId]  # Get specific attempt
PUT    /api/problems/[id]/attempts/[attemptId]  # Update attempt
DELETE /api/problems/[id]/attempts/[attemptId]  # Delete attempt
```

### Error Handling
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: User doesn't own the resource
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resource (e.g., same URL)
- **500 Internal Server Error**: Database or system errors

## Component Architecture

### Page Components
```
app/
├── page.tsx              # Dashboard (landing + authenticated view)
├── problems/
│   ├── page.tsx          # Problem list
│   ├── [id]/
│   │   ├── page.tsx      # Problem detail
│   │   └── attempt/
│   │       └── page.tsx  # New attempt form
└── layout.tsx            # Root layout with Clerk provider
```

### Reusable Components
```
components/
├── ui/                   # shadcn/ui primitives
├── add-problem-dialog.tsx # Problem creation modal
└── delete-problem-dialog.tsx # Deletion confirmation
```

### State Management
- **Server State**: React Server Components for data fetching
- **Client State**: React useState for form data and UI state
- **Global State**: Clerk provides authentication context
- **URL State**: Next.js router for navigation and filters

## Development Patterns

### File Organization
- **Co-location**: Related files grouped by feature
- **Separation of Concerns**: UI, logic, and data layers clearly separated
- **TypeScript First**: All code written in TypeScript
- **Component Composition**: Small, focused components

### Data Fetching
- **Server Components**: Direct database queries in RSC
- **API Routes**: Client-side mutations and dynamic data
- **Static Generation**: Landing pages and marketing content
- **Incremental Static Regeneration**: User dashboards with fresh data

### Error Boundaries
- **API Level**: Comprehensive error handling in routes
- **Component Level**: Error boundaries for UI failures
- **Database Level**: Transaction rollbacks and constraint validation

## Performance Considerations

### Frontend Optimization
- **Bundle Splitting**: Automatic code splitting by Next.js
- **Image Optimization**: Next.js image component
- **Font Optimization**: Preloaded Google Fonts
- **CSS Purging**: Tailwind removes unused styles

### Backend Optimization
- **Connection Pooling**: Neon handles database connections
- **Query Optimization**: Drizzle generates efficient SQL
- **Caching**: Static generation where appropriate
- **Serverless**: Auto-scaling based on demand

### Database Optimization
- **Indexes**: Primary keys and foreign key indexes
- **Query Patterns**: Efficient joins and filtering
- **Connection Management**: Serverless connections via HTTP

## Deployment Architecture

### Vercel Platform
- **Edge Functions**: API routes deployed globally
- **Static Assets**: CDN distribution
- **Environment Variables**: Secure configuration management
- **Preview Deployments**: Branch-based staging environments

### Database Deployment
- **Neon Branching**: Database branches for different environments
- **Migration Strategy**: Automated migrations on deployment
- **Backup Strategy**: Automated backups by Neon
- **Monitoring**: Built-in database monitoring

## Security Considerations

### Authentication Security
- **JWT Validation**: Clerk handles token verification
- **Session Management**: Secure cookie handling
- **CSRF Protection**: Built into Next.js
- **XSS Prevention**: React's built-in protections

### Data Security
- **Input Validation**: Server-side validation on all inputs
- **SQL Injection**: Prevented by Drizzle's query builder
- **Data Isolation**: User-scoped database queries
- **Environment Variables**: Secrets stored securely

### Network Security
- **HTTPS Only**: Enforced by Vercel
- **CORS Configuration**: Restrictive CORS policies
- **Rate Limiting**: Can be added via middleware
- **Content Security Policy**: Can be implemented in headers

## Monitoring and Observability

### Application Monitoring
- **Vercel Analytics**: Performance and usage metrics
- **Error Tracking**: Console errors and API failures
- **Performance Monitoring**: Core Web Vitals tracking

### Database Monitoring
- **Neon Console**: Connection and query monitoring
- **Drizzle Studio**: Visual database browser
- **Query Performance**: Slow query identification

### Development Tools
- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Hot Reload**: Fast development iteration