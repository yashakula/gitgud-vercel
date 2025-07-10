"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle, AlertCircle, Calendar, Clock } from "lucide-react";

type Attempt = {
  id: string;
  status: "solved" | "partial" | "failed";
  timeTaken: number | null;
  createdAt: string;
};

interface DeleteProblemDialogProps {
  children: React.ReactNode;
  problemId: string;
  problemTitle: string;
  onConfirmDelete: () => void;
}

export function DeleteProblemDialog({ 
  children, 
  problemId, 
  problemTitle, 
  onConfirmDelete 
}: DeleteProblemDialogProps) {
  const [open, setOpen] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAttempts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/problems/${problemId}/attempts`);
      if (response.ok) {
        const data = await response.json();
        setAttempts(data);
      }
    } catch (error) {
      console.error("Error fetching attempts:", error);
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => {
    if (open) {
      fetchAttempts();
    }
  }, [open, fetchAttempts]);

  const handleConfirmDelete = () => {
    setOpen(false);
    onConfirmDelete();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Problem</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{problemTitle}&quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-pulse">Loading attempts...</div>
            </div>
          ) : attempts.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">
                This will delete {attempts.length} attempt{attempts.length > 1 ? 's' : ''}:
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 border rounded-md p-3 bg-muted/30">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(attempt.status)}
                      <Badge className={getStatusColor(attempt.status)} variant="secondary">
                        {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                      </Badge>
                      {attempt.timeTaken && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {attempt.timeTaken}m
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(attempt.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No attempts have been made for this problem.
            </div>
          )}

          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Warning: This action will permanently delete the problem and all associated attempts.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
          >
            Delete Problem
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}