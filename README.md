# GitGud - Coding Interview Journal

> Track your coding interview preparation with brutal honesty

GitGud is a personal coding journal application that helps software engineers systematically track their interview preparation by logging coding problems and practice attempts. Built with modern serverless technologies for scalability and developer experience.

## 🚀 Features

- **Problem Management**: Add coding problems from LeetCode, HackerRank, or custom URLs
- **Attempt Tracking**: Record multiple attempts per problem with timing and notes
- **Progress Analytics**: Track success rates and improvement over time
- **User Authentication**: Secure login with Clerk integration
- **Responsive UI**: Clean, modern interface built with Tailwind CSS and shadcn/ui

## 🏗️ Tech Stack

### Core Framework
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling

### Backend & Database
- **Neon**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations
- **Clerk**: Authentication and user management

### UI Components
- **shadcn/ui**: Pre-built component library
- **Radix UI**: Unstyled, accessible components
- **Lucide React**: Icon library

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Clerk account
- Neon database account

### Environment Variables
Create a `.env.local` file:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://username:password@host/database

# Optional: Clerk webhook endpoints
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd gitgud-vercel
   npm install
   ```

2. **Set up the database**
   ```bash
   npm run db:generate  # Generate migrations
   npm run db:migrate   # Apply migrations
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply database migrations
- `npm run db:studio` - Open Drizzle Studio for database management

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── problems/      # Problem CRUD operations
│   │   └── normalize-urls/# URL normalization endpoint
│   ├── problems/          # Problem management pages
│   └── layout.tsx         # Root layout with Clerk provider
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── add-problem-dialog.tsx
│   └── delete-problem-dialog.tsx
├── lib/                  # Utilities and configuration
│   ├── db/               # Database configuration
│   │   ├── index.ts      # Drizzle setup
│   │   ├── schema.ts     # Database schema
│   │   └── migrations/   # Generated migrations
│   └── utils.ts          # Utility functions
└── middleware.ts         # Clerk authentication middleware
```

## 🗄️ Database Schema

The application uses a PostgreSQL database with three main tables:

- **users**: Clerk user data synchronization
- **problems**: Coding problems with metadata
- **attempts**: Practice attempt records

See [docs/database.md](docs/database.md) for detailed schema documentation.

## 🔐 Authentication Flow

GitGud uses Clerk for authentication with the following integration points:

1. **Middleware**: `clerkMiddleware()` protects all routes
2. **API Authentication**: `auth()` extracts user ID from session
3. **Database Sync**: Users auto-created on first API call
4. **Data Isolation**: All queries filtered by authenticated user

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - automatic builds on push

### Database Setup
- Create Neon database
- Run migrations: `npm run db:migrate`
- Verify connection in Drizzle Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Neon Documentation](https://neon.tech/docs)