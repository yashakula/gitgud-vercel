import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, problems } from "@/lib/db";
import { eq } from "drizzle-orm";
import { normalizeUrl } from "@/lib/utils";

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all problems for this user
    const userProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.userId, userId));

    let updatedCount = 0;

    for (const problem of userProblems) {
      if (problem.url) {
        const normalizedUrl = normalizeUrl(problem.url);
        
        if (normalizedUrl !== problem.url) {
          await db
            .update(problems)
            .set({ url: normalizedUrl })
            .where(eq(problems.id, problem.id));
          
          updatedCount++;
        }
      }
    }

    return NextResponse.json({ 
      message: `Normalized ${updatedCount} URLs`,
      updatedCount 
    });
  } catch (error) {
    console.error("Error normalizing URLs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}