# GitGud - Coding Interview Journal

## 🎯 App Concept
A coding journal application for software engineers to track their interview preparation by logging coding problems and practice attempts.

## 📋 Core Requirements

### User Stories
- **As a software engineer**, I want to log coding problems I've practiced so I can track my progress
- **As a user**, I want to add problems by URL (LeetCode, HackerRank, etc.) for easy reference
- **As a user**, I want to record multiple attempts at the same problem to track improvement
- **As a user**, I want to see my practice history and patterns

### Essential Features
1. **Problem Management**
   - Add problems by URL (auto-fetch metadata when possible)
   - Manual problem entry with title, description, difficulty
   - Tag/categorize problems (algorithms, data structures, etc.)

2. **Attempt Tracking**
   - Multiple attempts per problem
   - Track attempt date/time
   - Record attempt outcome (solved, partially solved, failed)
   - Notes for each attempt
   - Time taken to solve

3. **User Authentication**
   - Clerk integration (already implemented)
   - Personal journal - each user sees only their data

## 🗄️ Database Schema (Neon/PostgreSQL)

### Tables Structure
```sql
-- Users table (managed by Clerk)
users
- clerk_id (string, primary key)
- email (string)
- created_at (timestamp)
- updated_at (timestamp)

-- Problems table
problems
- id (uuid, primary key)
- user_id (string, foreign key to users.clerk_id)
- title (string)
- description (text, optional)
- url (string, optional)
- platform (string, e.g., "leetcode", "hackerrank")
- difficulty (enum: easy, medium, hard)
- tags (string array)
- created_at (timestamp)
- updated_at (timestamp)

-- Attempts table
attempts
- id (uuid, primary key)
- problem_id (uuid, foreign key to problems.id)
- user_id (string, foreign key to users.clerk_id)
- status (enum: solved, partial, failed)
- time_taken (integer, minutes)
- notes (text, optional)
- solution_code (text, optional)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🎨 UI/UX Structure

### Pages/Routes
1. **Dashboard** (`/`)
   - Recent activity
   - Quick stats (problems solved, attempts made)
   - Quick add problem form

2. **Problems List** (`/problems`)
   - All problems with filtering/sorting
   - Search functionality
   - Add new problem button

3. **Problem Detail** (`/problems/[id]`)
   - Problem information
   - All attempts for this problem
   - Add new attempt form

4. **Add Problem** (`/problems/new`)
   - Form to add problem by URL or manually
   - URL parsing for popular platforms

5. **Analytics** (`/analytics`)
   - Progress tracking
   - Problem difficulty distribution
   - Success rate trends

### Components
- Problem Card
- Attempt Card
- Problem Form
- Attempt Form
- Stats Dashboard
- Search/Filter Bar

## 🔧 Technical Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Clerk for authentication

### Backend
- Next.js API Routes
- Drizzle ORM for database operations
- Neon PostgreSQL database

### Deployment
- Vercel for hosting
- Vercel PostgreSQL integration with Neon

## 🚀 API Endpoints

### Problems
- `GET /api/problems` - List user's problems
- `POST /api/problems` - Create new problem
- `GET /api/problems/[id]` - Get specific problem
- `PUT /api/problems/[id]` - Update problem
- `DELETE /api/problems/[id]` - Delete problem

### Attempts
- `GET /api/problems/[id]/attempts` - List attempts for a problem
- `POST /api/problems/[id]/attempts` - Create new attempt
- `PUT /api/attempts/[id]` - Update attempt
- `DELETE /api/attempts/[id]` - Delete attempt

### URL Parsing
- `POST /api/parse-url` - Parse problem URL for metadata

## 📈 Future Enhancements
- Problem recommendation system
- Spaced repetition scheduling
- Code execution and testing
- Shared problem sets
- Interview preparation streaks
- Export data functionality
- Mobile app

## 🔒 Security Considerations
- User data isolation (each user only sees their data)
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure handling of external URLs

## 🎯 Success Metrics
- Problems logged per user
- Attempts per problem
- User retention and engagement
- Problem solving improvement over time

## 🌍 Environment Management

### Development vs Production Setup
**Development Environment:**
- Separate Clerk project for dev (different API keys)
- Separate Neon database for development
- Local development connecting to cloud services
- `.env.local` for local development variables

**Production Environment:**
- Production Clerk project
- Production Neon database
- Vercel production environment variables
- `.env.production` for production-specific config

### Environment Variables Structure
```bash
# Development (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dev_...
CLERK_SECRET_KEY=sk_test_dev_...
DATABASE_URL=postgresql://dev_user:password@dev-db.neon.tech/dev_db
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (Vercel Environment Variables)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_prod_...
CLERK_SECRET_KEY=sk_live_prod_...
DATABASE_URL=postgresql://prod_user:password@prod-db.neon.tech/prod_db
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## 🛠️ Development Workflow

### Local Development Setup
1. **Database Connection**
   - Local app connects to cloud Neon database
   - Connection pooling for optimal performance
   - SSL/TLS encryption for secure connections

2. **Authentication Flow**
   - Local development uses Clerk dev environment
   - Separate user bases for dev/prod
   - Test users and scenarios

3. **Hot Reloading**
   - Next.js dev server with Turbopack
   - Real-time database changes reflected locally

### Database Management
```bash
# Database Operations
npm run db:generate    # Generate migrations
npm run db:migrate     # Run migrations
npm run db:seed        # Seed development data
npm run db:studio      # Open Drizzle Studio
npm run db:reset       # Reset development database
```

## 🗄️ Database Strategy

### Migration Management
- **Drizzle ORM** for schema management
- Version-controlled migrations
- Automatic migration on deployment
- Rollback capabilities

### Development Data Seeding
- Sample problems from popular platforms
- Test user data for different scenarios
- Mock attempts and progress data

### Connection Management
- Connection pooling (recommended: 5-10 connections for dev)
- Connection timeout and retry logic
- Graceful degradation on database errors

## 🚀 Deployment Strategy

### Vercel Integration
- **Preview Deployments**: Use development database
- **Production Deployments**: Use production database
- **Environment Variables**: Managed via Vercel dashboard

### CI/CD Pipeline
```yaml
# Deployment workflow
1. Code push to branch
2. Vercel preview deployment (dev DB)
3. Run tests and checks
4. Merge to main
5. Production deployment (prod DB)
6. Run post-deployment migrations
```

## 📊 Monitoring & Observability

### Database Monitoring
- Connection pool metrics
- Query performance tracking
- Slow query identification
- Database size and growth monitoring

### Application Monitoring
- Error tracking (Sentry integration)
- Performance monitoring (Web Vitals)
- User analytics (privacy-focused)
- API endpoint performance

### Logging Strategy
```typescript
// Structured logging
logger.info('Problem created', {
  userId: user.id,
  problemId: problem.id,
  platform: problem.platform,
  timestamp: new Date().toISOString()
});
```

## 🔒 Security Considerations

### Database Security
- Connection string encryption
- Row-level security (RLS) policies
- Query parameter sanitization
- Connection IP whitelisting

### API Security
- Rate limiting per user/IP
- Input validation middleware
- CORS configuration
- API key rotation strategy

### Data Protection
- User data isolation
- Secure handling of external URLs
- XSS prevention in user content
- CSRF protection

## 🚨 Error Handling & Resilience

### Database Errors
- Connection failure retry logic
- Transaction rollback on errors
- Graceful degradation for read operations
- Circuit breaker pattern for external APIs

### URL Parsing Reliability
- Fallback for unsupported platforms
- Timeout handling for external requests
- Validation of parsed metadata
- Manual override options

### User Experience
- Loading states for all operations
- Optimistic updates where appropriate
- Clear error messages and recovery actions
- Offline state handling

## 🎯 Performance Optimization

### Database Performance
- Proper indexing strategy
- Query optimization and analysis
- Connection pooling configuration
- Caching frequently accessed data

### Frontend Performance
- Server-side rendering for initial load
- Client-side caching with SWR/React Query
- Image optimization for problem screenshots
- Code splitting and lazy loading

### Caching Strategy
```typescript
// Multi-layer caching
1. Browser cache (static assets)
2. CDN cache (Vercel Edge)
3. Application cache (Redis if needed)
4. Database query cache
```

## 🧪 Testing Strategy

### Test Environment Setup
- Separate test database
- Test user accounts in Clerk
- Mock external API responses
- Isolated test data

### Testing Levels
```bash
# Test commands
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:e2e         # End-to-end tests
npm run test:db          # Database tests
```

### Test Data Management
- Automated test data cleanup
- Database snapshots for consistent testing
- Mock data factories
- Test user management

## 📈 Scaling Considerations

### Database Scaling
- Connection pool optimization
- Read replicas for heavy read operations
- Database sharding strategy (future)
- Query optimization and indexing

### Application Scaling
- Serverless function optimization
- Static asset optimization
- CDN utilization
- Memory usage optimization

## 🔧 Development Tools

### Recommended Extensions
- Database management (Drizzle Studio)
- API testing (REST Client)
- Environment management
- Code quality tools (ESLint, Prettier)

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx scripts/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```