"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  GeneratorInputSchema,
  type GeneratorInput,
  type GeneratorFormInput,
  MARKETING_GOAL_LABELS,
  MOOD_LABELS,
  SHOT_TYPE_LABELS,
  BACKGROUND_LABELS,
  ASPECT_RATIO_LABELS,
  MODEL_LABELS,
  DIETARY_FLAG_LABELS,
  PROP_LABELS,
  type MarketingGoal,
  type Mood,
  type ShotType,
  type Background,
  type AspectRatio,
  type TargetModel,
  type DietaryFlag,
  type Prop,
} from "@/lib/promptSpec";
import { BRAND_VIBE_PRESETS } from "@/lib/presets";

interface GeneratorFormProps {
  onSubmit: (data: GeneratorInput) => void;
  isLoading?: boolean;
}

export function GeneratorForm({ onSubmit, isLoading }: GeneratorFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<GeneratorFormInput, unknown, GeneratorInput>({
    resolver: zodResolver(GeneratorInputSchema),
    defaultValues: {
      dishName: "",
      keyIngredients: "",
      cuisineStyle: "",
      dietaryFlags: [],
      marketingGoal: "menu_hero",
      brandVibe: "",
      mood: "fresh",
      shotType: "angle_45",
      background: "studio_seamless",
      props: [],
      aspectRatio: "1:1",
      targetModel: "midjourney",
      strictIngredients: false,
      leaveNegativeSpace: false,
      quickFixes: [],
      referenceImageUrl: "",
      referenceImage: undefined,
    },
  });

  const processFile = (file: File) => {
    // 3MB limit (Next.js serverless payload limit is ~4.5MB, base64 adds 33%)
    const MAX_SIZE_MB = 3;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Image is too large. Please upload an image smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      // Remove data:image/...;base64, prefix
      const base64Data = base64.split(",")[1];
      form.setValue("referenceImage", base64Data);
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processFile(file);
    }
  };

  const removeImage = () => {
    form.setValue("referenceImage", undefined);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Image Upload Drop Zone - Moved to Top */}
        <FormItem>
          <FormLabel>Reference Image</FormLabel>
          <div
            onClick={!imagePreview && !isLoading ? triggerFileInput : undefined}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${imagePreview
              ? "border-primary bg-primary/5"
              : isDragging
                ? "border-primary bg-primary/10"
                : "border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer"
              }`}
          >
            {!imagePreview ? (
              <div className="text-center pointer-events-none">
                <div className="mx-auto w-12 h-12 mb-4 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <p className="text-sm font-medium mb-1">
                  {isDragging ? "Drop image here" : "Drop or upload image here"}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Max size: 3MB. AI will analyze details for better prompts
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isLoading}
            className="hidden"
          />
        </FormItem>

        <FormField
          control={form.control}
          name="referenceImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Paste a public image URL to use as reference for Midjourney/Flux.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dishName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dish Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Wagyu Beef Burger" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keyIngredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key Ingredients</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., wagyu patty, cheddar cheese, caramelized onions, brioche bun"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cuisineStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuisine Style</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., American, Japanese" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="marketingGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketing Goal *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(MARKETING_GOAL_LABELS) as MarketingGoal[]).map(
                      (key) => (
                        <SelectItem key={key} value={key}>
                          {MARKETING_GOAL_LABELS[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="brandVibe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand Vibe</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vibe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BRAND_VIBE_PRESETS.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(MOOD_LABELS) as Mood[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {MOOD_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="shotType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shot Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shot" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(SHOT_TYPE_LABELS) as ShotType[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {SHOT_TYPE_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="background"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select background" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(BACKGROUND_LABELS) as Background[]).map(
                      (key) => (
                        <SelectItem key={key} value={key}>
                          {BACKGROUND_LABELS[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aspect Ratio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(ASPECT_RATIO_LABELS) as AspectRatio[]).map(
                      (key) => (
                        <SelectItem key={key} value={key}>
                          {ASPECT_RATIO_LABELS[key]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(Object.keys(MODEL_LABELS) as TargetModel[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {MODEL_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dietaryFlags"
          render={() => (
            <FormItem>
              <FormLabel>Dietary Flags</FormLabel>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(DIETARY_FLAG_LABELS) as DietaryFlag[]).map(
                  (flag) => (
                    <FormField
                      key={flag}
                      control={form.control}
                      name="dietaryFlags"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(flag)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                if (checked) {
                                  field.onChange([...current, flag]);
                                } else {
                                  field.onChange(
                                    current.filter((v) => v !== flag)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <Label className="text-sm font-normal">
                            {DIETARY_FLAG_LABELS[flag]}
                          </Label>
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="props"
          render={() => (
            <FormItem>
              <FormLabel>Props</FormLabel>
              <div className="flex flex-wrap gap-4">
                {(Object.keys(PROP_LABELS) as Prop[]).map((prop) => (
                  <FormField
                    key={prop}
                    control={form.control}
                    name="props"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(prop)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, prop]);
                              } else {
                                field.onChange(current.filter((v) => v !== prop));
                              }
                            }}
                          />
                        </FormControl>
                        <Label className="text-sm font-normal">
                          {PROP_LABELS[prop]}
                        </Label>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <FormField
            control={form.control}
            name="strictIngredients"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label className="text-sm">Strict Ingredients Only</Label>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leaveNegativeSpace"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label className="text-sm">Leave Space for Text</Label>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Prompts"}
        </Button>
      </form>
    </Form>
  );
}
