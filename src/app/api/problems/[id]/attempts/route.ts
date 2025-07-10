import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, attempts, problems } from "@/lib/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify the problem belongs to the user
    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, params.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Get all attempts for this problem
    const problemAttempts = await db
      .select()
      .from(attempts)
      .where(eq(attempts.problemId, params.id))
      .orderBy(desc(attempts.createdAt));

    return NextResponse.json(problemAttempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify the problem belongs to the user
    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, params.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const body = await request.json();
    const { status, timeTaken, notes, solutionCode } = body;

    // Validate required fields
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Create the attempt
    const [newAttempt] = await db
      .insert(attempts)
      .values({
        problemId: params.id,
        userId,
        status,
        timeTaken: timeTaken || null,
        notes: notes || null,
        solutionCode: solutionCode || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newAttempt, { status: 201 });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}