import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, problems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { normalizeUrl } from "@/lib/utils";

export async function POST() {
  console.log("POST /api/normalize-urls - Request received");
  try {
    const { userId } = await auth();
    console.log("POST /api/normalize-urls - Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      console.log("POST /api/normalize-urls - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all problems for this user
    console.log("POST /api/normalize-urls - Fetching user problems");
    const userProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.userId, userId));

    console.log("POST /api/normalize-urls - Processing URL normalization", { problemCount: userProblems.length });
    let updatedCount = 0;

    for (const problem of userProblems) {
      if (problem.url) {
        const normalizedUrl = normalizeUrl(problem.url);
        
        if (normalizedUrl !== problem.url) {
          console.log("POST /api/normalize-urls - Normalizing URL for problem", { problemId: problem.id });
          await db
            .update(problems)
            .set({ url: normalizedUrl })
            .where(eq(problems.id, problem.id));
          
          updatedCount++;
        }
      }
    }

    console.log("POST /api/normalize-urls - URL normalization completed", { updatedCount });
    return NextResponse.json({ 
      message: `Normalized ${updatedCount} URLs`,
      updatedCount 
    });
  } catch (error) {
    console.error("Error normalizing URLs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}