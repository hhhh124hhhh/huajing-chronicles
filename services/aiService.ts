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
    
    try {
      switch (provider.toLowerCase()) {
        case 'ernie':
          return new ErnieService();
        case 'qwen':
          return new QwenService();
        case 'doubao':
          return new DoubaoService();
        case 'gemini':
        default:
          // 检查Gemini API密钥格式是否正确
          const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
          if (!geminiApiKey.startsWith('AIza')) {
            console.warn('Invalid Gemini API key format. Falling back to Doubao service.');
            return new DoubaoService();
          }
          return new GeminiService();
      }
    } catch (error) {
      console.error('Failed to create AI service. Falling back to Doubao service:', error);
      return new DoubaoService();
    }
  }
}

export const aiService = AIServiceFactory.createService();
