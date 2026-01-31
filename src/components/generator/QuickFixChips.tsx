"use client";

import { Badge } from "@/components/ui/badge";
import { QUICK_FIX_LABELS, type QuickFix } from "@/lib/promptSpec";

interface QuickFixChipsProps {
  selected: QuickFix[];
  onChange: (fixes: QuickFix[]) => void;
}

export function QuickFixChips({ selected, onChange }: QuickFixChipsProps) {
  const toggleFix = (fix: QuickFix) => {
    if (selected.includes(fix)) {
      onChange(selected.filter((f) => f !== fix));
    } else {
      onChange([...selected, fix]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Quick Fixes (regenerate with):</p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(QUICK_FIX_LABELS) as QuickFix[]).map((fix) => (
          <Badge
            key={fix}
            variant={selected.includes(fix) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleFix(fix)}
          >
            {QUICK_FIX_LABELS[fix]}
          </Badge>
        ))}
      </div>
    </div>
  );
}
