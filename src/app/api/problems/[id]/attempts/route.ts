import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, attempts, problems } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  console.log("GET /api/problems/[id]/attempts - Request received", { problemId: resolvedParams.id });
  try {
    const { userId } = await auth();
    console.log("GET /api/problems/[id]/attempts - Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      console.log("GET /api/problems/[id]/attempts - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify the problem belongs to the user
    console.log("GET /api/problems/[id]/attempts - Verifying problem ownership");
    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, resolvedParams.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      console.log("GET /api/problems/[id]/attempts - Problem not found or access denied", { problemId: resolvedParams.id });
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Get all attempts for this problem
    console.log("GET /api/problems/[id]/attempts - Fetching attempts for problem");
    const problemAttempts = await db
      .select()
      .from(attempts)
      .where(eq(attempts.problemId, resolvedParams.id))
      .orderBy(desc(attempts.createdAt));

    console.log("GET /api/problems/[id]/attempts - Attempts fetched successfully", { 
      problemId: resolvedParams.id, 
      attemptCount: problemAttempts.length 
    });
    return NextResponse.json(problemAttempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  console.log("POST /api/problems/[id]/attempts - Request received", { problemId: resolvedParams.id });
  try {
    const { userId } = await auth();
    console.log("POST /api/problems/[id]/attempts - Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      console.log("POST /api/problems/[id]/attempts - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify the problem belongs to the user
    console.log("POST /api/problems/[id]/attempts - Verifying problem ownership");
    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, resolvedParams.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      console.log("POST /api/problems/[id]/attempts - Problem not found or access denied", { problemId: resolvedParams.id });
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status, timeTaken, notes, solutionCode } = body;
    console.log("POST /api/problems/[id]/attempts - Request body parsed", { 
      status, 
      hasTimeTaken: !!timeTaken, 
      hasNotes: !!notes, 
      hasSolutionCode: !!solutionCode 
    });

    // Validate required fields
    if (!status) {
      console.log("POST /api/problems/[id]/attempts - Missing required status field");
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Create the attempt
    console.log("POST /api/problems/[id]/attempts - Creating new attempt");
    const [newAttempt] = await db
      .insert(attempts)
      .values({
        problemId: resolvedParams.id,
        userId,
        status,
        timeTaken: timeTaken || null,
        notes: notes || null,
        solutionCode: solutionCode || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log("POST /api/problems/[id]/attempts - Attempt created successfully", { 
      problemId: resolvedParams.id, 
      attemptId: newAttempt.id 
    });
    return NextResponse.json(newAttempt, { status: 201 });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}