import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, attempts, problems } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; attemptId: string } }
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

    // Check if attempt exists and belongs to the user
    const attempt = await db
      .select()
      .from(attempts)
      .where(and(
        eq(attempts.id, params.attemptId),
        eq(attempts.problemId, params.id),
        eq(attempts.userId, userId)
      ))
      .limit(1);

    if (attempt.length === 0) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }

    // Delete the attempt
    await db
      .delete(attempts)
      .where(eq(attempts.id, params.attemptId));

    return NextResponse.json({ message: "Attempt deleted successfully" });
  } catch (error) {
    console.error("Error deleting attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}