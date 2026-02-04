import type { PromptSpec } from "@/lib/promptSpec";
import { MARKETING_GOAL_LABELS, MOOD_LABELS, SHOT_TYPE_LABELS, BACKGROUND_LABELS, LIGHTING_LABELS } from "@/lib/promptSpec";

export function renderBanana(basePrompt: string, spec: PromptSpec): string {
  // Pro-Marketer 2.0 Framework for Nano Banana (Flux)
  
  const sections: string[] = [];
  
  // ========================================
  // [CORE MANDATE]
  // ========================================
  if (spec.referenceImageUrl) {
    sections.push(
      `Use the uploaded image as the absolute reference. DO NOT change the food's identity, plating, or ingredients. ` +
      `Maintain the original shape and details of the product while only enhancing the surroundings and lighting for professional marketing.`
    );
  }
  
  // ========================================
  // [SUBJECT]
  // ========================================
  const marketingGoal = spec.modelHints?.targetModel || "commercial";
  const mood = spec.mood || "fresh";
  const props = spec.props && spec.props.length > 0 ? spec.props.join(", ") : "natural garnishes";
  
  sections.push(
    `A ${marketingGoal} grade shot of the food from the reference image. ` +
    `The dish should look ${mood} with ${props} added naturally around it.`
  );
  
  // ========================================
  // [SETTING & COMPOSITION]
  // ========================================
  // CRITICAL: Use original user shotType from modelHints, NOT LLM-generated camera description
  const userShotType = spec.modelHints?.shotType || "angle_45";
  const shotType = userShotType; // Use user's original selection
  const background = spec.background || "clean studio background";
  
  // Determine if top-down (no background blur)
  const shotTypeLower = shotType.toLowerCase().replace(/_/g, '-'); // Normalize underscores to dashes
  const isTopDown = shotTypeLower.includes('top-down') || 
                    shotTypeLower.includes('overhead') ||
                    shotTypeLower.includes('flat lay');
  
  // Convert shot type to readable format
  let shotDescription = shotType;
  if (shotTypeLower.includes('45-degree') || shotTypeLower.includes('angle-45')) {
    shotDescription = "45-degree angle";
  } else if (isTopDown) {
    shotDescription = "Top-Down Flat Lay";
  } else if (shotTypeLower.includes('eye-level') || shotTypeLower.includes('eye level')) {
    shotDescription = "Eye-Level";
  } else if (shotTypeLower.includes('macro')) {
    shotDescription = "Extreme Close-Up Macro";
  }
  
  if (isTopDown) {
    // Top-down: No background blur
    sections.push(
      `Positioned in a ${shotDescription}. The background is a ${background}, sharp and visible to add context.`
    );
  } else {
    // Other angles: Background blur with bokeh
    sections.push(
      `Positioned in a ${shotDescription}. The background is a ${background}, beautifully blurred to create a professional bokeh effect.`
    );
  }
  
  // ========================================
  // [LIGHTING]
  // ========================================
  const lighting = spec.lighting || "soft natural lighting";
  const qualityBoosts = spec.style || "photorealistic"; // Quality keywords from user selection
  
  sections.push(
    `Enhanced with ${lighting} to create depth. Use soft natural highlights to make the textures look ${qualityBoosts}.`
  );
  
  // ========================================
  // [TECHNICAL SPECS]
  // ========================================
  const aspectRatio = spec.modelHints?.aspectRatio || "1:1";
  
  sections.push(
    `Nano Banana model, ${aspectRatio} aspect ratio, 8k resolution, vibrant but natural colors, ` +
    `commercial advertising style, sharp focus on the food product.`
  );
  
  // ========================================
  // [FINAL REMINDER]
  // ========================================
  if (spec.referenceImageUrl) {
    sections.push(
      `Keep the food items exactly as shown in the reference image, only enhancing the steam and background atmosphere.`
    );
  }
  
  // Join all sections
  const finalPrompt = sections.join(" ");
  
  // Add image reference URL at the beginning
  if (spec.referenceImageUrl) {
    return `(Image Reference: ${spec.referenceImageUrl}) ${finalPrompt}`;
  }
  
  return finalPrompt;
}

