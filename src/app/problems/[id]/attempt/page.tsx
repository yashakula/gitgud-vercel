"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export default function RecordAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: "partial" as "solved" | "partial" | "failed",
    timeTaken: "",
    notes: "",
    solutionCode: "",
  });

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
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/problems/${params.id}/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: formData.status,
          timeTaken: formData.timeTaken ? parseInt(formData.timeTaken) : null,
          notes: formData.notes || null,
          solutionCode: formData.solutionCode || null,
        }),
      });

      if (response.ok) {
        router.push(`/problems/${params.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error recording attempt:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex-1 space-y-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
      <div className="flex-1 space-y-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Problem not found</h1>
          <p className="text-muted-foreground mt-2">
            The problem you&apos;re trying to record an attempt for doesn&apos;t exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/problems">Back to Problems</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter">
              Sign in to record attempts
            </h1>
          </div>
          <SignInButton>
            <Button size="lg">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Header */}
        <div className="space-y-4">
          <Button variant="ghost" asChild className="pl-0">
            <Link href={`/problems/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Problem
            </Link>
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Record Attempt</h1>
            <p className="text-muted-foreground">
              Document your attempt at solving this problem
            </p>
          </div>
        </div>

        {/* Problem Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-xl">{problem.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                  </Badge>
                </div>
              </div>
              {problem.url && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={problem.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Problem
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          {problem.description && (
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {problem.description}
              </p>
            </CardContent>
          )}
        </Card>

        {/* Attempt Form */}
        <Card>
          <CardHeader>
            <CardTitle>Record Your Attempt</CardTitle>
            <CardDescription>
              Fill in the details of your problem-solving attempt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value as "solved" | "partial" | "failed" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solved">✅ Solved</SelectItem>
                      <SelectItem value="partial">⚠️ Partial Solution</SelectItem>
                      <SelectItem value="failed">❌ Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeTaken">Time Taken (minutes)</Label>
                  <Input
                    id="timeTaken"
                    type="number"
                    placeholder="e.g., 45"
                    value={formData.timeTaken}
                    onChange={(e) => setFormData({ ...formData, timeTaken: e.target.value })}
                    min="1"
                    max="1440"
                  />
                  <p className="text-sm text-muted-foreground">
                    How long did you spend on this attempt?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="notes">Notes</Label>
                
                {/* Reflection Prompts */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Track your progress:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">• What worked well in your solution?</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <p className="text-sm text-orange-800 dark:text-orange-200">• What was difficult or unexpected?</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-sm text-green-800 dark:text-green-200">• Time & space complexity</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                      <p className="text-sm text-purple-800 dark:text-purple-200">• Key insights or patterns learned</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Textarea
                    id="notes"
                    placeholder="Describe your approach, what worked, what didn't, lessons learned, etc."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="min-h-[150px]"
                    maxLength={500}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Document your thought process, challenges faced, and any insights gained</span>
                    <span className={formData.notes.length > 450 ? "text-orange-600 dark:text-orange-400" : ""}>
                      {formData.notes.length}/500
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="solutionCode">Solution Code (Optional)</Label>
                <Textarea
                  id="solutionCode"
                  placeholder="Paste your code solution here..."
                  value={formData.solutionCode}
                  onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Include your working solution, partial attempt, or pseudocode
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/problems/${params.id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Recording..." : "Record Attempt"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SignedIn>
    </div>
  );
}