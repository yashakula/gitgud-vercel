import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, problems, users } from "@/lib/db";
import { eq, desc, and } from "drizzle-orm";
import { deriveTitleFromUrl, normalizeUrl } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.userId, userId))
      .orderBy(desc(problems.createdAt));

    return NextResponse.json(userProblems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, difficulty, tags } = body;

    // Validate required fields
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize the URL to handle trailing slashes and other variations
    const normalizedUrl = normalizeUrl(url);

    // Check if problem with this URL already exists for this user
    // We need to get all problems and check for normalized URL matches
    // because existing data might not be normalized
    const allUserProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.userId, userId));
    
    const existingProblem = allUserProblems.find(problem => 
      normalizeUrl(problem.url || '') === normalizedUrl
    );

    if (existingProblem) {
      return NextResponse.json(
        { error: "You already have a problem with this URL", existingProblem: existingProblem },
        { status: 409 }
      );
    }

    // Derive title from URL if not provided
    const problemTitle = title || deriveTitleFromUrl(normalizedUrl);

    // Ensure user exists in our database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length === 0) {
      // Create user if doesn't exist
      await db.insert(users).values({
        clerkId: userId,
        email: "", // This will be updated when we have access to user email
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Process tags - split by comma and trim whitespace
    const processedTags = tags 
      ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      : [];

    // Create the problem
    const [newProblem] = await db
      .insert(problems)
      .values({
        userId,
        title: problemTitle,
        description: description || null,
        url: normalizedUrl,
        platform: "unknown",
        difficulty: difficulty || "medium",
        tags: processedTags,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    console.error("Error creating problem:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}