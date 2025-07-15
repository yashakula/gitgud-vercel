"use client";

import { useEffect, useState } from "react";
import { BookOpen, Trophy, Clock, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatsData {
  totalProblems: number;
  solved: number;
  inProgress: number;
  successRate: number;
  completedToday: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    totalProblems: 0,
    solved: 0,
    inProgress: 0,
    successRate: 0,
    completedToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-10 w-10 bg-muted animate-pulse rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-muted animate-pulse rounded mb-1"></div>
              <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Problems</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalProblems}</div>
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
          <div className="text-3xl font-bold">{stats.solved}</div>
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
          <div className="text-3xl font-bold">{stats.inProgress}</div>
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
          <div className="text-3xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">Overall success rate</p>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Today</CardTitle>
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.completedToday}</div>
          <p className="text-xs text-muted-foreground">Completed today</p>
        </CardContent>
      </Card>
    </div>
  );
}