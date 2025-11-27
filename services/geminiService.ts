
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
  private apiKey: string;
  private modelId: string;
  private imageModelId: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    this.modelId = 'gemini-2.5-flash';
    this.imageModelId = 'gemini-2.5-flash-image';
  }

  private async sendRequest(endpoint: string, body: any): Promise<any> {
    // 检查API密钥格式是否正确（Google Gemini API密钥通常以AIza开头）
    if (!this.apiKey.startsWith('AIza')) {
      throw new Error('Invalid Gemini API key format. Google Gemini API keys should start with "AIza".');
    }
    
    const url = `/api/gemini${endpoint}?key=${this.apiKey}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // 尝试获取错误详情
        let errorDetails = '';
        try {
          const errorJson = await response.json();
          errorDetails = JSON.stringify(errorJson, null, 2);
        } catch (e) {
          errorDetails = await response.text();
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}\nDetails: ${errorDetails}`);
      }

      return response.json();
    } catch (e) {
      console.error(`Request to ${url} failed:`, e);
      throw e;
    }
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await this.sendRequest(`/models/${this.modelId}:generateContent`, {
        contents: [{ parts: [{ text: prompt }] }]
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (e) {
      console.error("Text generation error:", e);
      return '';
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.sendRequest(`/models/${this.imageModelId}:generateContent`, {
        contents: [{ parts: [{ text: prompt }] }]
      });
      return extractImageFromResponse(response);
    } catch (e) {
      console.error("Image generation error:", e);
      return null;
    }
  }

  createChat(systemInstruction: string): any {
    const self = this;
    return {
      async sendMessage(message: string): Promise<string> {
        const response = await self.sendRequest(`/models/${self.modelId}:generateContent`, {
          contents: [
            { parts: [{ text: systemInstruction }] },
            { parts: [{ text: message }] }
          ]
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }
    };
  }

  async generateJSON(prompt: string, schema: any): Promise<any> {
    try {
      const response = await this.sendRequest(`/models/${this.modelId}:generateContent`, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      return JSON.parse(response.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    } catch (e) {
      console.error("JSON generation error:", e);
      return {};
    }
  }
}

// 移除了循环依赖的代码，这些函数将在其他地方实现
