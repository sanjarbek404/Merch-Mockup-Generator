import { GoogleGenAI, Type } from "@google/genai";
import { MockupTemplate, UserLogo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SmartPlacementResult {
  scale: number;
  x: number;
  y: number;
  opacity: number;
  reasoning: string;
}

export async function getSmartPlacement(
  template: MockupTemplate,
  logo: UserLogo
): Promise<SmartPlacementResult> {
  const prompt = `
    You are an expert product designer. I have a merch mockup template and a user logo.
    
    Template: ${template.name} (${template.category})
    Logo Dimensions: ${logo.width}x${logo.height}
    
    Suggest the optimal placement for this logo on the product to make it look professional and aesthetically pleasing.
    The coordinates (x, y) are offsets from the default placement center (0.5, 0.5).
    The scale is a multiplier (1.0 is default).
    The opacity is between 0 and 1 (usually around 0.9 for realism).
    
    Return the result in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scale: { type: Type.NUMBER, description: "Scale multiplier (0.5 to 1.5)" },
            x: { type: Type.NUMBER, description: "X offset (-0.2 to 0.2)" },
            y: { type: Type.NUMBER, description: "Y offset (-0.2 to 0.2)" },
            opacity: { type: Type.NUMBER, description: "Opacity (0.7 to 1.0)" },
            reasoning: { type: Type.STRING, description: "Brief explanation of the placement" }
          },
          required: ["scale", "x", "y", "opacity", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      scale: result.scale ?? 1,
      x: result.x ?? 0,
      y: result.y ?? 0,
      opacity: result.opacity ?? 0.9,
      reasoning: result.reasoning ?? "Optimized for visual balance."
    };
  } catch (error) {
    console.error("AI Smart Placement failed:", error);
    return {
      scale: 1,
      x: 0,
      y: 0,
      opacity: 0.9,
      reasoning: "Default placement used due to an error."
    };
  }
}
