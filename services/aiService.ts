export interface AIService {
  generateText(prompt: string): Promise<string>;
  generateImage(prompt: string): Promise<string | null>;
  createChat(systemInstruction: string): any;
  generateJSON(prompt: string, schema: any): Promise<any>;
}

// 提前导入所有AI服务
import { GeminiService } from './geminiService';
import { ErnieService } from './ernieService';
import { QwenService } from './qwenService';
import { DoubaoService } from './doubaoService';

export class AIServiceFactory {
  static createService(): AIService {
    const provider = import.meta.env.VITE_AI_PROVIDER || 'gemini';
    
    switch (provider.toLowerCase()) {
      case 'ernie':
        return new ErnieService();
      case 'qwen':
        return new QwenService();
      case 'doubao':
        return new DoubaoService();
      case 'gemini':
      default:
        return new GeminiService();
    }
  }
}

export const aiService = AIServiceFactory.createService();
