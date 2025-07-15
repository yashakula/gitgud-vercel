import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Plus, BookOpen, Trophy, Clock, TrendingUp, Code, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddProblemDialog } from "@/components/add-problem-dialog";

export default function Home() {
  return (
    <div className="flex-1 space-y-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <SignedOut>
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-muted/30 rounded-2xl"></div>
          <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center space-y-8 px-4 py-16">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-foreground flex items-center justify-center">
                  <Code className="h-6 w-6 text-background" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  GitGud
                </h1>
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-foreground">
                Master Coding
                <br />
                <span className="text-muted-foreground">
                  Interviews
                </span>
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
                Your personal coding interview journal. Track problems, document solutions, 
                and measure your progress with precision analytics.
              </p>
            </div>
            <div className="max-w-[800px] mx-auto space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Turn your coding practice into real progress. Our platform helps you track your practice sessions so you can learn from your mistakes. Because the difference between developers who land their dream jobs and those who don&apos;t isn&apos;t just talent—it&apos;s the discipline to learn from every mistake, understand every solution, and never stumble on the same problem twice. It&apos;s time to just GitGud.
              </p>
              <SignInButton>
                <Button size="lg" className="text-lg px-8 py-6 bg-foreground text-background hover:bg-foreground/90">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="bg-foreground rounded-2xl p-12 text-center text-background">
          <h3 className="text-3xl font-bold mb-4">Ready to Level Up?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join developers who are acing their interviews with structured practice
          </p>
          <SignInButton>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-background text-foreground hover:bg-background/90">
              <Trophy className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Dashboard Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-muted/30 rounded-2xl"></div>
          <div className="relative flex items-center justify-between p-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
              <p className="text-muted-foreground">
                Ready to tackle some coding challenges?
              </p>
            </div>
            <AddProblemDialog>
              <Button size="lg" className="shadow-sm">
                <Plus className="mr-2 h-5 w-5" />
                Add Problem
              </Button>
            </AddProblemDialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Problems</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Problems in your collection</p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Solved</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Trophy className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Currently working on</p>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0%</div>
              <p className="text-xs text-muted-foreground">Overall success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest problem attempts and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="flex items-center justify-center h-[200px] text-center">
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center mx-auto">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Ready to start your journey?</p>
                    <p className="text-sm text-muted-foreground">
                      Add your first problem to begin tracking your progress
                    </p>
                  </div>
                  <AddProblemDialog>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Problem
                    </Button>
                  </AddProblemDialog>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump right into your coding practice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AddProblemDialog>
                <Button className="w-full justify-start h-12" variant="outline">
                  <Plus className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Add New Problem</div>
                    <div className="text-xs text-muted-foreground">Start with a coding challenge</div>
                  </div>
                </Button>
              </AddProblemDialog>
              <Button asChild className="w-full justify-start h-12" variant="outline">
                <Link href="/problems">
                  <BookOpen className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">View All Problems</div>
                    <div className="text-xs text-muted-foreground">Browse your collection</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SignedIn>
    </div>
  );
}