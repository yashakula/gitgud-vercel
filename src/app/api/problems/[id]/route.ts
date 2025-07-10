import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, problems } from "@/lib/db";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const problem = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, params.id), eq(problems.userId, userId)))
      .limit(1);

    if (problem.length === 0) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem[0]);
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, platform, difficulty, tags } = body;

    // Validate required fields
    if (!title || !platform || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Process tags
    const processedTags = tags 
      ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      : [];

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
      .where(and(eq(problems.id, params.id), eq(problems.userId, userId)))
      .returning();

    if (!updatedProblem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProblem);
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedProblem = await db
      .delete(problems)
      .where(and(eq(problems.id, params.id), eq(problems.userId, userId)))
      .returning();

    if (deletedProblem.length === 0) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}