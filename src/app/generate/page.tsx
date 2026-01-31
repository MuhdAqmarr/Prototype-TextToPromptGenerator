"use client";

import { useState } from "react";
import { GeneratorForm } from "@/components/generator/GeneratorForm";
import { ResultsPanel } from "@/components/generator/ResultsPanel";
import { useSavedPrompts } from "@/store/savedPrompts";
import type { GeneratorInput, GeneratorOutput, QuickFix } from "@/lib/promptSpec";

export default function GeneratePage() {
  const [output, setOutput] = useState<GeneratorOutput | null>(null);
  const [currentInput, setCurrentInput] = useState<GeneratorInput | null>(null);
  const [quickFixes, setQuickFixes] = useState<QuickFix[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addPrompt } = useSavedPrompts();

  const handleSubmit = async (data: GeneratorInput) => {
    setIsLoading(true);
    setCurrentInput(data);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, quickFixes }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate");
      }

      const result = await response.json();
      setOutput(result);
    } catch (error) {
      console.error("Generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentInput) return;
    await handleSubmit({ ...currentInput, quickFixes });
  };

  const handleSave = () => {
    if (!currentInput || !output) return;
    addPrompt(currentInput, output);
  };

  return (
    <div className="container py-6 md:py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Generate Prompts</h1>
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        <div>
          <GeneratorForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ResultsPanel
            output={output}
            input={currentInput}
            quickFixes={quickFixes}
            onQuickFixChange={setQuickFixes}
            onRegenerate={handleRegenerate}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
