
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { QuizData, AgeGroup, ModuleRecord, FinancialReport, IntroData } from "../types";
import { AIService } from "./aiService";

// Helper to construct image prompts based on user style
const getStylePrompt = (style: string) => {
  switch (style) {
    case 'cyberpunk':
      return "Cyberpunk art style, neon lights, rain, futuristic city, dark atmosphere, purple and teal.";
    case 'noir':
      return "Film Noir art style, black and white, dramatic shadows, mystery, detective atmosphere.";
    case 'anime':
      return "Anime background art, detailed clouds, emotional lighting, city of the future.";
    case 'oil':
      return "Oil painting style, moody, expressive, dark palette, concept art.";
    default:
      return "Cinematic concept art, atmospheric lighting.";
  }
};

const extractImageFromResponse = (response: any): string | null => {
  try {
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
  } catch (e) {
    console.error("Error extracting image data:", e);
  }
  return null;
};

export class GeminiService implements AIService {
  private ai: GoogleGenAI;
  private modelId: string;
  private imageModelId: string;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });
    this.modelId = 'gemini-2.5-flash';
    this.imageModelId = 'gemini-2.5-flash-image';
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: this.modelId,
      contents: prompt
    });
    return response.text || '';
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: this.imageModelId,
        contents: { parts: [{ text: prompt }] },
      });
      return extractImageFromResponse(response);
    } catch (e) {
      console.error("Image generation error:", e);
      return null;
    }
  }

  createChat(systemInstruction: string): Chat {
    return this.ai.chats.create({ model: this.modelId, config: { systemInstruction } });
  }

  async generateJSON(prompt: string, schema: any): Promise<any> {
    const response = await this.ai.models.generateContent({
      model: this.modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });
    return JSON.parse(response.text || "{}");
  }
}

// 移除了循环依赖的代码，这些函数将在其他地方实现
