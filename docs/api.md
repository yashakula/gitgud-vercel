# API Documentation

## Overview

GitGud provides a RESTful API built with Next.js API routes. All endpoints require authentication via Clerk and automatically filter data by the authenticated user.

## Authentication

All API endpoints require a valid Clerk session. The middleware automatically validates sessions and provides the `userId` to API routes.

### Headers
```http
Cookie: __session=<clerk_session_token>
Content-Type: application/json
```

### Error Responses
```json
// 401 Unauthorized
{
  "error": "Unauthorized"
}

// 500 Internal Server Error  
{
  "error": "Internal server error"
}
```

---

## Problems API

### List Problems
Retrieve all problems for the authenticated user.

```http
GET /api/problems
```

**Response**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user_2xyz...",
    "title": "Two Sum",
    "description": "Given an array of integers...",
    "url": "https://leetcode.com/problems/two-sum",
    "platform": "unknown",
    "difficulty": "easy",
    "tags": ["array", "hash-table"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Create Problem
Add a new coding problem.

```http
POST /api/problems
```

**Request Body**
```json
{
  "title": "Two Sum",           // Optional - auto-derived from URL if not provided
  "description": "Given an array...", // Optional
  "url": "https://leetcode.com/problems/two-sum/", // Required
  "difficulty": "easy",         // Optional - defaults to "medium"
  "tags": "array, hash-table"   // Optional - comma-separated string
}
```

**Response**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user_2xyz...",
  "title": "Two Sum",
  "description": "Given an array...",
  "url": "https://leetcode.com/problems/two-sum",
  "platform": "unknown",
  "difficulty": "easy", 
  "tags": ["array", "hash-table"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**
```json
// 400 Bad Request - Missing URL
{
  "error": "URL is required"
}

// 409 Conflict - Duplicate URL
{
  "error": "You already have a problem with this URL",
  "existingProblem": {
    "id": "existing-problem-id",
    // ... existing problem data
  }
}
```

### Get Problem
Retrieve a specific problem by ID.

```http
GET /api/problems/{id}
```

**Response**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user_2xyz...",
  "title": "Two Sum",
  "description": "Given an array...",
  "url": "https://leetcode.com/problems/two-sum",
  "platform": "unknown",
  "difficulty": "easy",
  "tags": ["array", "hash-table"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses**
```json
// 404 Not Found
{
  "error": "Problem not found"
}
```

### Update Problem
Update an existing problem.

```http
PUT /api/problems/{id}
```

**Request Body**
```json
{
  "title": "Updated Title",
  "description": "Updated description...",
  "difficulty": "medium",
  "tags": "array, hash-table, dynamic-programming"
}
```

**Response**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  // ... updated problem data
}
```

### Delete Problem
Delete a problem and all associated attempts.

```http
DELETE /api/problems/{id}
```

**Response**
```json
{
  "message": "Problem deleted successfully"
}
```

---

## Attempts API

### List Attempts
Get all attempts for a specific problem.

```http
GET /api/problems/{problemId}/attempts
```

**Response**
```json
[
  {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "problemId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "user_2xyz...",
    "status": "solved",
    "timeTaken": 45,
    "notes": "Used hash map approach, O(n) time complexity",
    "solutionCode": "def twoSum(nums, target):\n    ...",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

### Create Attempt
Record a new attempt at solving a problem.

```http
POST /api/problems/{problemId}/attempts
```

**Request Body**
```json
{
  "status": "solved",          // Required: "solved" | "partial" | "failed"
  "timeTaken": 45,            // Optional: time in minutes
  "notes": "Used hash map...", // Optional: attempt notes
  "solutionCode": "def twoSum..." // Optional: solution code
}
```

**Response**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "problemId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user_2xyz...",
  "status": "solved",
  "timeTaken": 45,
  "notes": "Used hash map approach, O(n) time complexity",
  "solutionCode": "def twoSum(nums, target):\n    ...",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

**Error Responses**
```json
// 400 Bad Request - Invalid status
{
  "error": "Status is required and must be 'solved', 'partial', or 'failed'"
}

// 404 Not Found - Problem doesn't exist
{
  "error": "Problem not found"
}
```

### Get Attempt
Retrieve a specific attempt.

```http
GET /api/problems/{problemId}/attempts/{attemptId}
```

**Response**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "problemId": "123e4567-e89b-12d3-a456-426614174000",
  "userId": "user_2xyz...",
  "status": "solved",
  "timeTaken": 45,
  "notes": "Used hash map approach, O(n) time complexity",
  "solutionCode": "def twoSum(nums, target):\n    ...",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

### Update Attempt
Modify an existing attempt.

```http
PUT /api/problems/{problemId}/attempts/{attemptId}
```

**Request Body**
```json
{
  "status": "solved",
  "timeTaken": 40,
  "notes": "Optimized the solution...",
  "solutionCode": "def twoSum(nums, target):\n    # optimized version..."
}
```

**Response**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  // ... updated attempt data
}
```

### Delete Attempt
Remove an attempt record.

```http
DELETE /api/problems/{problemId}/attempts/{attemptId}
```

**Response**
```json
{
  "message": "Attempt deleted successfully"
}
```

---

## Utility Endpoints

### Normalize URLs
Utility endpoint for normalizing problem URLs.

```http
POST /api/normalize-urls
```

**Request Body**
```json
{
  "urls": [
    "https://leetcode.com/problems/two-sum/",
    "https://hackerrank.com/challenges/array-sum/"
  ]
}
```

**Response**
```json
{
  "normalized": [
    "https://leetcode.com/problems/two-sum",
    "https://hackerrank.com/challenges/array-sum"
  ]
}
```

---

## Data Types

### Problem Object
```typescript
interface Problem {
  id: string;              // UUID
  userId: string;          // Clerk user ID
  title: string;           // Problem title
  description?: string;    // Problem description (optional)
  url?: string;           // Problem URL (optional)
  platform?: string;      // Platform name (optional)
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];        // Array of tag strings (optional)
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}
```

### Attempt Object
```typescript
interface Attempt {
  id: string;              // UUID
  problemId: string;       // Foreign key to Problem
  userId: string;          // Clerk user ID
  status: "solved" | "partial" | "failed";
  timeTaken?: number;      // Time in minutes (optional)
  notes?: string;          // Attempt notes (optional)
  solutionCode?: string;   // Solution code (optional)
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
```

### User Object
```typescript
interface User {
  clerkId: string;         // Clerk user ID (primary key)
  email: string;           // User email
  createdAt: string;       // ISO date string
  updatedAt: string;       // ISO date string
}
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting middleware for production use:

```typescript
// Example rate limiting implementation
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## Error Handling Best Practices

### Client-Side Error Handling
```typescript
async function createProblem(problemData: CreateProblemRequest) {
  try {
    const response = await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problemData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create problem');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating problem:', error);
    throw error;
  }
}
```

### Server-Side Error Handling
```typescript
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // ... business logic
    
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```