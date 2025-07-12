# Dokploy VPS Deployment Plan

## Overview
Deploy GitGud on existing Dokploy VPS with self-hosted database, running in Docker containers with Cloudflare tunnel integration.

## Phase 1: Database Migration Strategy (Revised with Drizzle)

### Drizzle's Migration Advantages
**Schema Migration (Easy)**
- **Drizzle Kit**: Can generate the same schema on PostgreSQL as currently on Neon
- **Cross-database compatibility**: Drizzle abstracts PostgreSQL differences
- **Migration files**: Existing migrations in `src/lib/db/migrations/` should work on self-hosted PostgreSQL
- **Command**: `npm run db:migrate` will apply schema to new database

**Data Migration (Still Complex)**
- **Limitation**: Drizzle doesn't handle data migration between database instances
- **Schema vs Data**: Drizzle manages schema changes, not moving existing records
- **Manual Process**: Still need to export/import actual user data (problems, attempts, users)

### Self-hosted PostgreSQL Setup
- **Container**: PostgreSQL 15+ Docker container managed by Dokploy
- **Schema Setup**: Use existing Drizzle migrations for schema consistency
- **Data Migration**: Choose from multiple strategies (see below)
- **Backup Strategy**: Automated daily backups with retention policy
- **Volume Management**: Persistent Docker volumes for database data

### Database Configuration
- Create new database instance in Dokploy
- Apply schema using `npm run db:migrate`
- Configure connection pooling (PgBouncer if needed)
- Set up monitoring and health checks
- Generate new `DATABASE_URL` for local PostgreSQL

## Phase 2: Application Containerization
### Docker Configuration
- **Multi-stage Dockerfile**: Optimize for production Next.js builds
- **Base Image**: Node.js 18+ Alpine for minimal size
- **Build Process**: Install deps → Build Next.js → Copy artifacts
- **Runtime**: Minimal runtime image with only production files

### Environment Strategy
- **Separate Clerk App**: New Clerk application for Dokploy environment
- **Environment Variables**: Dokploy environment management
- **Secrets Management**: Database credentials, API keys via Dokploy secrets
- **Port Configuration**: Internal port 3000, external via reverse proxy

## Phase 3: Cloudflare Tunnel Integration
### Tunnel Configuration
- **Cloudflared Container**: Separate container running cloudflared daemon
- **Network Communication**: Docker network for service-to-tunnel communication
- **Domain Setup**: Subdomain for Dokploy deployment (e.g., `dokploy.gitgud.app`)
- **SSL/TLS**: Automatic HTTPS via Cloudflare

### Dokploy Template Usage
- Use Dokploy's Cloudflare template for automated tunnel setup
- Configure tunnel to point to GitGud container port
- Set up health checks and automatic restarts

## Phase 4: Deployment Pipeline
### Git Strategy
- **Branch**: `dokploy-deploy` for deployment-specific configurations
- **Dockerfile**: Add to repository root
- **CI/CD**: Dokploy auto-deploy on push to specific branch
- **Rollback**: Dokploy built-in rollback capabilities

### Build Process
1. Dokploy pulls from GitHub branch
2. Builds Docker image with Next.js app
3. Deploys container with database connectivity
4. Cloudflare tunnel routes traffic to container
5. Health checks ensure service availability

## Phase 5: Service Architecture
```
Internet → Cloudflare → Tunnel → Dokploy VPS → GitGud Container
                                             → PostgreSQL Container
```

### Container Communication
- **Internal Network**: Docker network for app-database communication
- **External Access**: Only via Cloudflare tunnel (no direct VPS access)
- **Service Discovery**: Docker DNS for container-to-container communication

## Phase 6: Configuration Files Needed
### Dockerfile
- Multi-stage build for Next.js optimization
- Production environment configuration
- Health check endpoints

### docker-compose.yml (for Dokploy)
- GitGud application service
- PostgreSQL database service
- Cloudflared tunnel service
- Network and volume definitions

### Environment Variables
- `DATABASE_URL`: Self-hosted PostgreSQL connection
- `NEXT_PUBLIC_CLERK_*`: New Clerk app credentials
- `CLERK_SECRET_KEY`: Separate Clerk secret
- Cloudflare tunnel token and configuration

## Phase 7: Detailed Migration Strategies

### Strategy A: Database Dump/Restore (Recommended)
```bash
# 1. Schema Setup
npm run db:migrate  # Apply schema to new PostgreSQL

# 2. Export from Neon
pg_dump $NEON_DATABASE_URL --data-only > gitgud_data.sql

# 3. Import to self-hosted
psql $LOCAL_DATABASE_URL < gitgud_data.sql
```

### Strategy B: Application-Level Migration
```typescript
// Migration script using Drizzle
import { db as neonDb } from './lib/db-neon';
import { db as localDb } from './lib/db-local';

async function migrateData() {
  // Export users
  const users = await neonDb.select().from(usersTable);
  await localDb.insert(usersTable).values(users);
  
  // Export problems
  const problems = await neonDb.select().from(problemsTable);
  await localDb.insert(problemsTable).values(problems);
  
  // Export attempts
  const attempts = await neonDb.select().from(attemptsTable);
  await localDb.insert(attemptsTable).values(attempts);
}
```

### Strategy C: Drizzle Studio Export/Import
- Use Drizzle Studio to export data from Neon
- Import data into self-hosted PostgreSQL via Studio

### Zero-Downtime Migration Approach
1. **Parallel Setup**: Set up PostgreSQL with schema via Drizzle migrations
2. **Data Sync**: Initial bulk data migration + ongoing sync
3. **Cutover**: Switch `DATABASE_URL` to point to self-hosted PostgreSQL
4. **Validation**: Verify all data migrated correctly

### Data Validation Using Drizzle
```typescript
// Compare record counts
const neonCounts = await neonDb.select({ count: count() }).from(problemsTable);
const localCounts = await localDb.select({ count: count() }).from(problemsTable);

// Validate specific records
const randomProblems = await neonDb.select().from(problemsTable).limit(10);
// Verify same records exist in local DB
```

## Phase 8: Implementation Steps
1. **Database Setup**: Create PostgreSQL container in Dokploy
2. **Schema Migration**: Run `npm run db:migrate` on new database
3. **Data Migration**: Execute chosen migration strategy
4. **Data Validation**: Verify migration success using Drizzle queries
5. **Application Setup**: Create GitGud application in Dokploy
6. **Cloudflare Config**: Set up tunnel and domain routing
7. **Testing**: Validate all functionality works end-to-end
8. **DNS**: Point subdomain to Cloudflare tunnel

## Benefits of This Approach
- **Cost Savings**: No Neon subscription, VPS-only costs
- **Full Control**: Complete database and application management
- **Security**: All traffic via Cloudflare tunnel, no exposed ports
- **Scalability**: Can scale VPS resources as needed
- **Learning**: Experience with self-hosted database management

## Critical Analysis & Risks

### 🔴 **Major Concerns**
- **Data Migration Complexity**: While Drizzle simplifies schema migration, data migration still requires careful planning
- **Resource Requirements**: VPS capacity may be insufficient for PostgreSQL + app
- **Operational Overhead**: Taking on full database administration responsibilities

### 🟡 **Medium Concerns**
- **Environment Separation**: Need clear isolation between Vercel and Dokploy environments
- **Docker Networking**: Complex container-to-container communication setup
- **Cloudflare Tunnel**: Learning curve with Dokploy's template limitations

### 📋 **Missing Elements**
1. **Disaster Recovery Plan**: Backup verification, restore testing, rollback procedures
2. **Monitoring Strategy**: Database performance, application health, infrastructure metrics
3. **Security Hardening**: Container security, access controls, secret rotation
4. **Performance Baseline**: Current metrics vs. expected VPS performance
5. **Maintenance Procedures**: Database maintenance, updates, system patches

### 🚨 **Recommendations**
1. **Start with Database PoC**: Test PostgreSQL container with sample data first
2. **Leverage Drizzle**: Use existing migrations for schema setup, focus planning on data migration
3. **Implement Monitoring**: Comprehensive metrics for database and application
4. **Create Migration Runbook**: Detailed procedures with validation checkpoints using Drizzle queries
5. **Consider Staging**: Test full deployment on smaller VPS environment first

### ✅ **Drizzle Advantages**
- **Schema Consistency**: Exact same schema structure guaranteed between Neon and self-hosted
- **Type Safety**: Same TypeScript types work with both databases
- **Migration Tracking**: Drizzle tracks which migrations are applied
- **Validation Tools**: Can use Drizzle queries to validate data migration success
- **Rollback Capability**: Can revert schema changes if needed

## Considerations
- **Database Management**: Backup, monitoring, and maintenance responsibility
- **Resource Requirements**: Ensure VPS has sufficient CPU/RAM for PostgreSQL + app
- **Monitoring**: Set up database and application monitoring
- **SSL**: Cloudflare handles SSL termination automatically

## Next Steps
1. Assess VPS resource capacity and performance requirements
2. Create detailed database migration and backup strategy
3. Develop monitoring and alerting plan
4. Build comprehensive testing and validation procedures

This plan maintains the existing Vercel deployment while creating a completely parallel, self-hosted alternative with in-house database management.