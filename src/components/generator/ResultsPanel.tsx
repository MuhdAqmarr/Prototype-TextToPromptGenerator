"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PromptCard } from "./PromptCard";
import { QuickFixChips } from "./QuickFixChips";
import type { GeneratorOutput, GeneratorInput, QuickFix } from "@/lib/promptSpec";

interface ResultsPanelProps {
  output: GeneratorOutput | null;
  input: GeneratorInput | null;
  quickFixes: QuickFix[];
  onQuickFixChange: (fixes: QuickFix[]) => void;
  onRegenerate: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function ResultsPanel({
  output,
  quickFixes,
  onQuickFixChange,
  onRegenerate,
  onSave,
  isLoading,
}: ResultsPanelProps) {
  if (!output) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] md:min-h-[400px] border rounded-lg bg-muted/50">
        <p className="text-sm md:text-base text-muted-foreground text-center px-4">
          Fill in the form and click Generate to see results
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Generated Prompts</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSave}>
            Save
          </Button>
        </div>
      </div>

      <QuickFixChips selected={quickFixes} onChange={onQuickFixChange} />

      {quickFixes.length > 0 && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          {isLoading ? "Regenerating..." : "Apply Quick Fixes"}
        </Button>
      )}

      <Tabs defaultValue="variants" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="negative">Negative</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="variants" className="space-y-4 mt-4">
          <PromptCard
            title="Variant A - Safe Commercial"
            prompt={output.outputs.variantA.prompt}
            type={output.outputs.variantA.type}
          />
          <PromptCard
            title="Variant B - Premium Editorial"
            prompt={output.outputs.variantB.prompt}
            type={output.outputs.variantB.type}
          />
          <PromptCard
            title="Variant C - Punchy Social"
            prompt={output.outputs.variantC.prompt}
            type={output.outputs.variantC.type}
          />
        </TabsContent>

        <TabsContent value="negative" className="mt-4">
          <PromptCard title="Negative Prompt" prompt={output.outputs.negative} />
        </TabsContent>

        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Suggested Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(output.outputs.settings).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between text-sm border-b pb-2"
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
