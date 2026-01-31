import type { GeneratorOutput } from "@/lib/promptSpec";

export interface SavedPrompt {
  id: string;
  input: Record<string, unknown>;
  output: GeneratorOutput;
  createdAt: string;
}

export interface StorageProvider {
  save(prompt: SavedPrompt): Promise<void>;
  get(id: string): Promise<SavedPrompt | null>;
  list(): Promise<SavedPrompt[]>;
  delete(id: string): Promise<void>;
}

export class NoOpStorageProvider implements StorageProvider {
  async save(): Promise<void> {}
  async get(): Promise<SavedPrompt | null> {
    return null;
  }
  async list(): Promise<SavedPrompt[]> {
    return [];
  }
  async delete(): Promise<void> {}
}
