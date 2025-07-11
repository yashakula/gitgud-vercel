import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Plus, BookOpen, Trophy, Clock, TrendingUp, Code, Target, BarChart3, Zap, CheckCircle2 } from "lucide-react";
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-3xl"></div>
          <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center space-y-8 px-4 py-16">
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GitGud
                </h1>
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none">
                Master Coding
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Interviews
                </span>
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-600 text-lg md:text-xl dark:text-gray-300">
                Your personal coding interview journal. Track problems, document solutions, 
                and measure your progress with precision analytics.
              </p>
            </div>
            <div className="max-w-[800px] mx-auto space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Turn your coding practice into real progress. Our platform helps you track your practice sessions so you can learn from your mistakes. Because the difference between developers who land their dream jobs and those who don't isn't just talent—it's the discipline to learn from every mistake, understand every solution, and never stumble on the same problem twice. It's time to just GitGud.
              </p>
              <SignInButton>
                <Button size="lg" className="text-lg px-8 py-6">
                  <Zap className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>


        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Level Up?</h3>
          <p className="text-lg mb-8 opacity-90">
            Join developers who are acing their interviews with structured practice
          </p>
          <SignInButton>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Trophy className="mr-2 h-5 w-5" />
              Get Started Free
            </Button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {/* Dashboard Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl"></div>
          <div className="relative flex items-center justify-between p-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to tackle some coding challenges?
              </p>
            </div>
            <AddProblemDialog>
              <Button size="lg" className="shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Problem
              </Button>
            </AddProblemDialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Problems</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">0</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Problems in your collection</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Solved</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">0</div>
              <p className="text-xs text-green-600 dark:text-green-400">Successfully completed</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">In Progress</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">0</div>
              <p className="text-xs text-orange-600 dark:text-orange-400">Currently working on</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Success Rate</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">0%</div>
              <p className="text-xs text-purple-600 dark:text-purple-400">Overall success rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg">
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
                  <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto">
                    <BookOpen className="h-8 w-8 text-white" />
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
          
          <Card className="border-0 shadow-lg">
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