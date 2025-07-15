"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Plus, BookOpen, Search, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddProblemDialog } from "@/components/add-problem-dialog";
import { DeleteProblemDialog } from "@/components/delete-problem-dialog";
import { uiLogger } from "@/lib/logger";

type Problem = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  platform: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[] | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    uiLogger.debug("ProblemsPage component mounted, fetching problems");
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    uiLogger.debug("Starting to fetch problems");
    try {
      const response = await fetch("/api/problems");
      if (response.ok) {
        const data = await response.json();
        uiLogger.info("Problems fetched successfully", { count: data.length });
        setProblems(data);
      } else {
        uiLogger.warn("Failed to fetch problems", { status: response.status });
      }
    } catch (error) {
      uiLogger.error("Error fetching problems", { error: error instanceof Error ? error.message : error });
    } finally {
      setLoading(false);
      uiLogger.debug("Loading state set to false");
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    console.log("ProblemsPage - Deleting problem", { problemId });
    try {
      const response = await fetch(`/api/problems/${problemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("ProblemsPage - Problem deleted successfully", { problemId });
        // Refetch problems after deletion
        fetchProblems();
      } else {
        const error = await response.json();
        console.log("ProblemsPage - Failed to delete problem", { problemId, error: error.error });
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "default";
      case "medium":
        return "secondary";
      case "hard":
        return "destructive";
      default:
        return "outline";
    }
  };
  return (
    <div className="flex-1 space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              Sign in to view your problems
            </h1>
          </div>
          <SignInButton>
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Problems</h2>
          <div className="flex items-center space-x-2">
            <AddProblemDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Problem
              </Button>
            </AddProblemDialog>
          </div>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
            <CardDescription>Find problems in your collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search problems..." className="pl-8" />
              </div>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[180px]">
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[180px]">
                <option value="">All Platforms</option>
                <option value="leetcode">LeetCode</option>
                <option value="hackerrank">HackerRank</option>
                <option value="codewars">CodeWars</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground">Loading problems...</p>
              </div>
            </CardContent>
          </Card>
        ) : problems.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">No problems yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Start building your problem collection by adding your first coding challenge.
                  </p>
                </div>
                <AddProblemDialog>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Problem
                  </Button>
                </AddProblemDialog>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {problems.map((problem) => (
              <Card key={problem.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          <Link href={`/problems/${problem.id}`} className="hover:text-primary transition-colors">
                            {problem.title}
                          </Link>
                        </h3>
                        {problem.url && (
                          <a 
                            href={problem.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1 text-sm text-muted-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Badge variant={getDifficultyVariant(problem.difficulty) as "default" | "secondary" | "destructive" | "outline"}>
                          {problem.difficulty}
                        </Badge>
                      </div>
                      
                      {problem.description && (
                        <p className="text-sm text-muted-foreground">{problem.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="flex gap-1">
                            {problem.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <span>{new Date(problem.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex items-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/problems/${problem.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <DeleteProblemDialog
                        problemId={problem.id}
                        problemTitle={problem.title}
                        onConfirmDelete={() => handleDeleteProblem(problem.id)}
                      >
                        <Button 
                          variant="destructive" 
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DeleteProblemDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </SignedIn>
    </div>
  );
}