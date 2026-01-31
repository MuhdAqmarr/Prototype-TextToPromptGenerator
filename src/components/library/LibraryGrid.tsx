"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROMPT_TEMPLATES,
  CATEGORY_LABELS,
  type PromptCategory,
  type PromptTemplate,
} from "@/lib/promptLibrary";
import { MARKETING_GOAL_LABELS, type MarketingGoal } from "@/lib/promptSpec";

interface LibraryGridProps {
  onUseTemplate: (template: PromptTemplate) => void;
}

export function LibraryGrid({ onUseTemplate }: LibraryGridProps) {
  const [categoryFilter, setCategoryFilter] = useState<PromptCategory | "all">(
    "all"
  );
  const [goalFilter, setGoalFilter] = useState<MarketingGoal | "all">("all");

  const filteredTemplates = PROMPT_TEMPLATES.filter((template) => {
    if (categoryFilter !== "all" && template.category !== categoryFilter) {
      return false;
    }
    if (goalFilter !== "all" && !template.goals.includes(goalFilter)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
        <div className="sm:w-48">
          <Select
            value={categoryFilter}
            onValueChange={(v) => setCategoryFilter(v as PromptCategory | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(Object.keys(CATEGORY_LABELS) as PromptCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:w-48">
          <Select
            value={goalFilter}
            onValueChange={(v) => setGoalFilter(v as MarketingGoal | "all")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              {(Object.keys(MARKETING_GOAL_LABELS) as MarketingGoal[]).map(
                (goal) => (
                  <SelectItem key={goal} value={goal}>
                    {MARKETING_GOAL_LABELS[goal]}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <Badge variant="secondary">
                  {CATEGORY_LABELS[template.category]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-3">
                {template.goals.map((goal) => (
                  <Badge key={goal} variant="outline" className="text-xs">
                    {MARKETING_GOAL_LABELS[goal]}
                  </Badge>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onUseTemplate(template)}
              >
                Use Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No templates match your filters
        </div>
      )}
    </div>
  );
}
