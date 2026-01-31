"use client";

import { useState } from "react";
import { SavedList } from "@/components/saved/SavedList";
import { ResultsPanel } from "@/components/generator/ResultsPanel";
import type { SavedPrompt } from "@/store/savedPrompts";

export default function SavedPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<SavedPrompt | null>(null);

  return (
    <div className="container py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Saved Prompts</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          View and manage your saved prompt generations
        </p>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        <div>
          <SavedList onView={setSelectedPrompt} />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          {selectedPrompt ? (
            <ResultsPanel
              output={selectedPrompt.output}
              input={selectedPrompt.input}
              quickFixes={[]}
              onQuickFixChange={() => {}}
              onRegenerate={() => {}}
              onSave={() => {}}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] border rounded-lg bg-muted/50">
              <p className="text-sm md:text-base text-muted-foreground text-center px-4">
                Select a saved prompt to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
