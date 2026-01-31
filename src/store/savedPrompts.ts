"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratorInput, GeneratorOutput } from "@/lib/promptSpec";

export interface SavedPrompt {
  id: string;
  input: GeneratorInput;
  output: GeneratorOutput;
  createdAt: string;
  name?: string;
}

interface SavedPromptsState {
  prompts: SavedPrompt[];
  addPrompt: (input: GeneratorInput, output: GeneratorOutput, name?: string) => string;
  removePrompt: (id: string) => void;
  getPrompt: (id: string) => SavedPrompt | undefined;
  clearAll: () => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useSavedPrompts = create<SavedPromptsState>()(
  persist(
    (set, get) => ({
      prompts: [],

      addPrompt: (input, output, name) => {
        const id = generateId();
        const newPrompt: SavedPrompt = {
          id,
          input,
          output,
          createdAt: new Date().toISOString(),
          name: name || input.dishName,
        };
        set((state) => ({
          prompts: [newPrompt, ...state.prompts],
        }));
        return id;
      },

      removePrompt: (id) => {
        set((state) => ({
          prompts: state.prompts.filter((p) => p.id !== id),
        }));
      },

      getPrompt: (id) => {
        return get().prompts.find((p) => p.id === id);
      },

      clearAll: () => {
        set({ prompts: [] });
      },
    }),
    {
      name: "promptforge-saved",
    }
  )
);
