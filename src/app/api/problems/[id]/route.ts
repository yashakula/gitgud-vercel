import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, problems } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { apiLogger } from "@/lib/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  apiLogger.debug("GET /api/problems/[id] - Request received", { problemId: resolvedParams.id });
  try {
    const { userId } = await auth();
    apiLogger.debug("Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      apiLogger.warn("Unauthorized access attempt to GET /api/problems/[id]");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    apiLogger.debug("Fetching problem from database");
    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, resolvedParams.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      apiLogger.warn("Problem not found", { problemId: resolvedParams.id });
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    apiLogger.info("Problem fetched successfully", { problemId: resolvedParams.id });
    return NextResponse.json(problem[0]);
  } catch (error) {
    apiLogger.error("Error fetching problem", { error: error instanceof Error ? error.message : error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  console.log("PUT /api/problems/[id] - Request received", { problemId: resolvedParams.id });
  try {
    const { userId } = await auth();
    console.log("PUT /api/problems/[id] - Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      console.log("PUT /api/problems/[id] - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, platform, difficulty, tags } = body;
    console.log("PUT /api/problems/[id] - Request body parsed", { 
      hasTitle: !!title, 
      hasDescription: !!description, 
      hasUrl: !!url, 
      platform, 
      difficulty, 
      hasTags: !!tags 
    });

    // Validate required fields
    if (!title || !platform || !difficulty) {
      console.log("PUT /api/problems/[id] - Missing required fields", { 
        hasTitle: !!title, 
        hasPlatform: !!platform, 
        hasDifficulty: !!difficulty 
      });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Process tags
    const processedTags = tags 
      ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      : [];
    console.log("PUT /api/problems/[id] - Tags processed", { tagCount: processedTags.length });

    console.log("PUT /api/problems/[id] - Updating problem in database");
    const [updatedProblem] = await db
      .update(problems)
      .set({
        title,
        description: description || null,
        url: url || null,
        platform,
        difficulty,
        tags: processedTags,
        updatedAt: new Date(),
      })
      .where(and(eq(problems.id, resolvedParams.id), eq(problems.userId, userId)))
      .returning();

    if (!updatedProblem) {
      console.log("PUT /api/problems/[id] - Problem not found for update", { problemId: resolvedParams.id });
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    console.log("PUT /api/problems/[id] - Problem updated successfully", { problemId: resolvedParams.id });
    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  console.log("DELETE /api/problems/[id] - Request received", { problemId: resolvedParams.id });
  try {
    const { userId } = await auth();
    console.log("DELETE /api/problems/[id] - Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      console.log("DELETE /api/problems/[id] - Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("DELETE /api/problems/[id] - Deleting problem from database");
    const deletedProblem = await db
      .delete(problems)
      .where(and(eq(problems.id, resolvedParams.id), eq(problems.userId, userId)))
      .returning();

    if (deletedProblem.length === 0) {
      console.log("DELETE /api/problems/[id] - Problem not found for deletion", { problemId: resolvedParams.id });
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    console.log("DELETE /api/problems/[id] - Problem deleted successfully", { problemId: resolvedParams.id });
    return NextResponse.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}