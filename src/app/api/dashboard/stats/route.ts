import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { problems, attempts } from "@/lib/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get total problems
    const totalProblemsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(eq(problems.userId, userId));

    const totalProblems = totalProblemsResult[0]?.count || 0;

    // Get solved problems (latest attempt per problem with status "solved")
    const solvedProblemsResult = await db
      .select({
        problemId: attempts.problemId,
        status: attempts.status,
        createdAt: attempts.createdAt,
      })
      .from(attempts)
      .innerJoin(problems, eq(problems.id, attempts.problemId))
      .where(eq(problems.userId, userId))
      .orderBy(attempts.createdAt);

    // Group by problem and get the latest attempt for each
    const latestAttempts = new Map();
    solvedProblemsResult.forEach((attempt) => {
      const existing = latestAttempts.get(attempt.problemId);
      if (!existing || new Date(attempt.createdAt) > new Date(existing.createdAt)) {
        latestAttempts.set(attempt.problemId, attempt);
      }
    });

    const solvedCount = Array.from(latestAttempts.values()).filter(
      (attempt) => attempt.status === "solved"
    ).length;

    const inProgressCount = Array.from(latestAttempts.values()).filter(
      (attempt) => attempt.status === "partial"
    ).length;

    // Calculate success rate
    const totalAttempted = latestAttempts.size;
    const successRate = totalAttempted > 0 ? Math.round((solvedCount / totalAttempted) * 100) : 0;

    // Get problems completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedTodayResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(attempts)
      .innerJoin(problems, eq(problems.id, attempts.problemId))
      .where(
        and(
          eq(problems.userId, userId),
          eq(attempts.status, "solved"),
          gte(attempts.createdAt, today)
        )
      );

    const completedToday = completedTodayResult[0]?.count || 0;

    return NextResponse.json({
      totalProblems,
      solved: solvedCount,
      inProgress: inProgressCount,
      successRate,
      completedToday,
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}