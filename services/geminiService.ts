
import { GoogleGenAI, Type } from "@google/genai";
import { WasteAnalysis } from "../types";

export const analyzeWasteImage = async (base64Image: string): Promise<WasteAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analyze this waste item for safe and legal disposal. 
  
  CRITICAL SAFETY RULES:
  1. Identify any hazardous substances (Lithium, Lead, Acids, Bio-hazards).
  2. If the item is hazardous, you MUST provide a 'safetyWarning' and a 'legalDisclaimer' explaining that illegal disposal can lead to fines or environmental harm.
  3. Reference general municipal rules but emphasize that the user must check local city bylaws.
  
  Categories: RECYCLING, COMPOST, LANDFILL, HAZARDOUS, E-WASTE.
  
  Response must include:
  - 'reasoning': Scientific/Mechanical reason for the bin choice.
  - 'legalDisclaimer': A note on the legality of disposing of this specific material (e.g. "Batteries are legally prohibited from trash bins in many states").
  - 'instructions': Preparation (rinsing, removing caps).`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Common name" },
          material: { type: Type.STRING, description: "Material type" },
          binType: { type: Type.STRING, description: "RECYCLING, COMPOST, LANDFILL, HAZARDOUS, E-WASTE" },
          confidence: { type: Type.NUMBER, description: "0-1" },
          instructions: { type: Type.STRING, description: "Preparation steps" },
          reasoning: { type: Type.STRING, description: "Educational explanation" },
          safetyWarning: { type: Type.STRING, description: "Immediate physical danger warning" },
          legalDisclaimer: { type: Type.STRING, description: "Jurisdiction-based legal warning" },
          isRecyclable: { type: Type.BOOLEAN },
        },
        required: ["item", "binType", "confidence", "instructions", "reasoning", "isRecyclable", "legalDisclaimer"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("Analysis failed");
  }

  return JSON.parse(resultText) as WasteAnalysis;
};
