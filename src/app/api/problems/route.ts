import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db, problems, users } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { deriveTitleFromUrl, normalizeUrl } from "@/lib/utils";
import { apiLogger } from "@/lib/logger";

export async function GET() {
  apiLogger.debug("GET /api/problems - Request received");
  try {
    const { userId } = await auth();
    apiLogger.debug("Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      apiLogger.warn("Unauthorized access attempt to GET /api/problems");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    apiLogger.debug("Fetching problems for user");
    const userProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.userId, userId))
      .orderBy(desc(problems.createdAt));

    apiLogger.info("Successfully fetched problems", { count: userProblems.length });
    return NextResponse.json(userProblems);
  } catch (error) {
    apiLogger.error("Error fetching problems", { error: error instanceof Error ? error.message : error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  apiLogger.debug("POST /api/problems - Request received");
  try {
    const { userId } = await auth();
    apiLogger.debug("Auth check completed", { hasUserId: !!userId });
    
    if (!userId) {
      apiLogger.warn("Unauthorized access attempt to POST /api/problems");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, url, difficulty, tags } = body;
    apiLogger.debug("Request body parsed", { 
      hasTitle: !!title, 
      hasDescription: !!description, 
      hasUrl: !!url, 
      difficulty, 
      hasTags: !!tags 
    });

    // Validate required fields
    if (!url) {
      apiLogger.warn("Missing required URL field");
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize the URL to handle trailing slashes and other variations
    const normalizedUrl = normalizeUrl(url);
    apiLogger.debug("URL normalized");

    // Check if problem with this URL already exists for this user
    apiLogger.debug("Checking for existing problems");
    const allUserProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.userId, userId));
    
    const existingProblem = allUserProblems.find(problem => 
      normalizeUrl(problem.url || '') === normalizedUrl
    );

    if (existingProblem) {
      apiLogger.info("Duplicate problem found", { problemId: existingProblem.id });
      return NextResponse.json(
        { error: "You already have a problem with this URL", existingProblem: existingProblem },
        { status: 409 }
      );
    }

    // Derive title from URL if not provided
    const problemTitle = title || deriveTitleFromUrl(normalizedUrl);
    apiLogger.debug("Problem title determined");

    // Ensure user exists in our database
    apiLogger.debug("Checking if user exists in database");
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length === 0) {
      apiLogger.info("Creating new user in database");
      await db.insert(users).values({
        clerkId: userId,
        email: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      apiLogger.debug("User already exists in database");
    }

    // Process tags
    const processedTags = tags 
      ? tags.split(",").map((tag: string) => tag.trim()).filter(Boolean)
      : [];
    apiLogger.debug("Tags processed", { tagCount: processedTags.length });

    // Create the problem
    apiLogger.debug("Creating new problem");
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

    apiLogger.info("Problem created successfully", { problemId: newProblem.id });
    return NextResponse.json(newProblem, { status: 201 });
  } catch (error) {
    apiLogger.error("Error creating problem", { error: error instanceof Error ? error.message : error });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}