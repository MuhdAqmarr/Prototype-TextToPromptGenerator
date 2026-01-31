"use client";

import { useRouter } from "next/navigation";
import { LibraryGrid } from "@/components/library/LibraryGrid";
import type { PromptTemplate } from "@/lib/promptLibrary";

export default function LibraryPage() {
  const router = useRouter();

  const handleUseTemplate = (template: PromptTemplate) => {
    const params = new URLSearchParams({
      template: template.id,
    });
    router.push(`/generate?${params.toString()}`);
  };

  return (
    <div className="container py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Prompt Library</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Browse curated prompt templates by food category and marketing goal
        </p>
      </div>
      <LibraryGrid onUseTemplate={handleUseTemplate} />
    </div>
  );
}
