"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deriveTitleFromUrl, normalizeUrl } from "@/lib/utils";

interface AddProblemDialogProps {
  children: React.ReactNode;
}

export function AddProblemDialog({ children }: AddProblemDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
  });
  const [urlError, setUrlError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AddProblemDialog - Form submission started", { url: formData.url });
    setIsSubmitting(true);
    setUrlError("");

    try {
      const normalizedUrl = normalizeUrl(formData.url);
      const title = deriveTitleFromUrl(normalizedUrl);
      console.log("AddProblemDialog - URL normalized and title derived", { normalizedUrl, title });
      
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url: normalizedUrl,
        }),
      });

      if (response.ok) {
        const newProblem = await response.json();
        console.log("AddProblemDialog - Problem created successfully, redirecting to attempt page", { 
          problemId: newProblem.id 
        });
        setOpen(false);
        setFormData({
          url: "",
        });
        router.push(`/problems/${newProblem.id}/attempt`);
      } else {
        const error = await response.json();
        console.log("AddProblemDialog - Failed to create problem", { 
          status: response.status, 
          error: error.error 
        });
        if (response.status === 409 && error.existingProblem) {
          // Problem already exists, show error but offer to go to existing problem
          console.log("AddProblemDialog - Duplicate problem detected", { 
            existingProblemId: error.existingProblem.id 
          });
          setUrlError(`You already have a problem with this URL. Would you like to record a new attempt instead?`);
        } else {
          setUrlError(error.error || "An error occurred while adding the problem.");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setUrlError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("AddProblemDialog - Form submission completed");
    }
  };

  const handleGoToExisting = async () => {
    console.log("AddProblemDialog - Navigating to existing problem", { url: formData.url });
    try {
      const normalizedUrl = normalizeUrl(formData.url);
      const response = await fetch("/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: deriveTitleFromUrl(normalizedUrl),
          url: normalizedUrl,
        }),
      });

      if (response.status === 409) {
        const error = await response.json();
        if (error.existingProblem) {
          console.log("AddProblemDialog - Redirecting to existing problem", { 
            problemId: error.existingProblem.id 
          });
          setOpen(false);
          setFormData({
            url: "",
          });
          setUrlError("");
          router.push(`/problems/${error.existingProblem.id}/attempt`);
        }
      }
    } catch (error) {
      console.error("Error getting existing problem:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Problem</DialogTitle>
          <DialogDescription>
            Enter the URL of the coding problem. The title will be automatically derived from the URL.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Problem URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://leetcode.com/problems/two-sum/"
              value={formData.url}
              onChange={(e) => {
                setFormData({ url: e.target.value });
                setUrlError("");
              }}
              required
              className={urlError ? "border-red-500" : ""}
            />
            {urlError ? (
              <div className="space-y-2">
                <p className="text-sm text-red-600">{urlError}</p>
                {urlError.includes("already have a problem") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGoToExisting}
                    className="text-xs"
                  >
                    Go to Existing Problem
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                The problem title will be automatically generated from the URL
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Problem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}