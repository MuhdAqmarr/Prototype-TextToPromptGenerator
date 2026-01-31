"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VariantType } from "@/lib/promptSpec";

interface PromptCardProps {
  title: string;
  prompt: string;
  type?: VariantType;
}

const typeLabels: Record<VariantType, string> = {
  safe_commercial: "Safe Commercial",
  premium_editorial: "Premium Editorial",
  punchy_social: "Punchy Social",
};

const typeColors: Record<VariantType, string> = {
  safe_commercial: "bg-blue-100 text-blue-800",
  premium_editorial: "bg-purple-100 text-purple-800",
  punchy_social: "bg-orange-100 text-orange-800",
};

export function PromptCard({ title, prompt, type }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {type && (
            <Badge variant="secondary" className={typeColors[type]}>
              {typeLabels[type]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-md p-3 text-sm font-mono mb-3 max-h-48 overflow-y-auto">
          {prompt}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="w-full"
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
      </CardContent>
    </Card>
  );
}
