"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useSavedPrompts,
  type SavedPrompt,
} from "@/store/savedPrompts";
import { MARKETING_GOAL_LABELS, MODEL_LABELS } from "@/lib/promptSpec";

interface SavedListProps {
  onView: (prompt: SavedPrompt) => void;
}

export function SavedList({ onView }: SavedListProps) {
  const { prompts, removePrompt, clearAll } = useSavedPrompts();

  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No saved prompts yet</p>
        <p className="text-sm text-muted-foreground">
          Generate some prompts and save them to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {prompts.length} saved prompt{prompts.length !== 1 ? "s" : ""}
        </p>
        <Button variant="outline" size="sm" onClick={clearAll}>
          Clear All
        </Button>
      </div>

      <div className="grid gap-4">
        {prompts.map((saved) => (
          <Card key={saved.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <CardTitle className="text-base">
                  {saved.name || saved.input.dishName}
                </CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">
                    {MODEL_LABELS[saved.input.targetModel]}
                  </Badge>
                  <Badge variant="outline">
                    {MARKETING_GOAL_LABELS[saved.input.marketingGoal]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Created: {new Date(saved.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onView(saved)}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePrompt(saved.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
