import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, attempts, problems } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
  const resolvedParams = await params;
  console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Request received", { 
    problemId: resolvedParams.id, 
    attemptId: resolvedParams.attemptId 
  });
  try {
    const { userId } = await auth();
    console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify the problem belongs to the user
    console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Verifying problem ownership");
    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, resolvedParams.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Problem not found or access denied", { 
        problemId: resolvedParams.id 
      });
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Check if attempt exists and belongs to the user
    console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Verifying attempt ownership");
    const attempt = await db
      .select()
      .from(attempts)
      .where(and(
        eq(attempts.id, resolvedParams.attemptId),
        eq(attempts.problemId, resolvedParams.id),
        eq(attempts.userId, userId)
      ))
      .limit(1);

    if (attempt.length === 0) {
      console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Attempt not found or access denied", { 
        problemId: resolvedParams.id, 
        attemptId: resolvedParams.attemptId 
      });
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Delete the attempt
    console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Deleting attempt from database");
    await db
      .delete(attempts)
      .where(eq(attempts.id, resolvedParams.attemptId));

    console.log("DELETE /api/problems/[id]/attempts/[attemptId] - Attempt deleted successfully", { 
      problemId: resolvedParams.id, 
      attemptId: resolvedParams.attemptId 
    });
    return NextResponse.json({ message: "Attempt deleted successfully" });
  } catch (error) {
    console.error("Error deleting attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}