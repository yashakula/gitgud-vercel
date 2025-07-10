"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowLeft, Plus, ExternalLink, Clock, Calendar, CheckCircle2, XCircle, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Problem = {
  id: string;
  title: string;
  description: string | null;
  url: string | null;
  platform: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[] | null;
  createdAt: string;
};

type Attempt = {
  id: string;
  problemId: string;
  userId: string;
  status: "solved" | "partial" | "failed";
  timeTaken: number | null;
  notes: string | null;
  solutionCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`/api/problems/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProblem(data);
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    const fetchAttempts = async () => {
      try {
        const response = await fetch(`/api/problems/${params.id}/attempts`);
        if (response.ok) {
          const data = await response.json();
          setAttempts(data);
        }
      } catch (error) {
        console.error("Error fetching attempts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
    fetchAttempts();
  }, [params.id]);

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!confirm("Are you sure you want to delete this attempt? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/problems/${params.id}/attempts/${attemptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refetch attempts after deleting
        const fetchAttempts = async () => {
          try {
            const response = await fetch(`/api/problems/${params.id}/attempts`);
            if (response.ok) {
              const data = await response.json();
              setAttempts(data);
            }
          } catch (error) {
            console.error("Error fetching attempts:", error);
          }
        };
        fetchAttempts();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting attempt:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleDeleteProblem = async () => {
    if (!confirm("Are you sure you want to delete this problem? This will also delete all attempts. This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/problems/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/problems");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex-1 space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Problem not found</h1>
          <p className="text-muted-foreground mt-2">
            The problem you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
          </p>
          <Button asChild className="mt-4">
            <Link href="/problems">Back to Problems</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              Sign in to view problem details
            </h1>
          </div>
          <SignInButton>
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Button variant="ghost" asChild className="pl-0">
              <Link href="/problems">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Problems
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </Badge>
              {problem.url && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={problem.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Problem
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href={`/problems/${params.id}/attempt`}>
                <Plus className="mr-2 h-4 w-4" />
                Record Attempt
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDeleteProblem}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Problem
            </Button>
          </div>
        </div>

        {/* Problem Details */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                {problem.description ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{problem.description}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No description available</p>
                )}
                {problem.tags && problem.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {problem.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Attempts</span>
                  <span className="text-2xl font-bold">{attempts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Success Rate</span>
                  <span className="text-2xl font-bold">
                    {attempts.length > 0 
                      ? Math.round((attempts.filter(a => a.status === 'solved').length / attempts.length) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Best Time</span>
                  <span className="text-2xl font-bold">
                    {attempts.filter(a => a.timeTaken && a.status === 'solved').length > 0
                      ? Math.min(...attempts.filter(a => a.timeTaken && a.status === 'solved').map(a => a.timeTaken!)) + 'm'
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Attempts History */}
        <Card>
          <CardHeader>
            <CardTitle>Attempt History</CardTitle>
            <CardDescription>
              Your previous attempts at solving this problem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No attempts recorded yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click &quot;Record Attempt&quot; to log your first attempt
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(attempt.status)}
                        <Badge className={getStatusColor(attempt.status)}>
                          {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                        </Badge>
                        {attempt.timeTaken && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {attempt.timeTaken}m
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(attempt.createdAt).toLocaleDateString()}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAttempt(attempt.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {attempt.notes && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Notes:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{attempt.notes}</p>
                      </div>
                    )}
                    
                    {attempt.solutionCode && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Solution Code:</h4>
                        <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto">
                          <code>{attempt.solutionCode}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </SignedIn>
    </div>
  );
}