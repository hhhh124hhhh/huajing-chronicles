import { AIService } from './aiService';

export class QwenService implements AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_QWEN_API_KEY || '';
    // 使用代理路径，避免跨域问题
    this.baseUrl = '/api/qwen';
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          input: {
            prompt: prompt
          },
          parameters: {
            result_format: 'text'
          }
        })
      });

      const data = await response.json();
      return data.output.text || '';
    } catch (error) {
      console.error('Qwen text generation error:', error);
      return '';
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/aigc/image-generation/generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'wanx-v1',
          input: {
            prompt: prompt
          },
          parameters: {
            size: '1024x1024',
            n: 1
          }
        })
      });

      const data = await response.json();
      if (data.output && data.output.results && data.output.results.length > 0) {
        return data.output.results[0].url;
      }
      return null;
    } catch (error) {
      console.error('Qwen image generation error:', error);
      return null;
    }
  }

  createChat(systemInstruction: string): any {
    // 通义千问的聊天功能实现
    const service = this;
    return {
      systemInstruction,
      async sendMessage(message: string): Promise<string> {
        const fullPrompt = `${systemInstruction}\n\n用户：${message}\n\n助手：`;
        return await service.generateText(fullPrompt);
      }
    };
  }

  async generateJSON(prompt: string, schema: any): Promise<any> {
    try {
      const jsonPrompt = `${prompt}\n\n请严格按照以下JSON schema格式输出结果：\n${JSON.stringify(schema, null, 2)}\n\n输出时只包含JSON内容，不要包含其他任何文字。`;
      
      const response = await fetch(`${this.baseUrl}/aigc/text-generation/generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          input: {
            prompt: jsonPrompt
          },
          parameters: {
            result_format: 'text'
          }
        })
      });

      const data = await response.json();
      try {
        return JSON.parse(data.output.text || '{}');
      } catch (parseError) {
        console.error('Failed to parse Qwen JSON response:', parseError);
        return {};
      }
    } catch (error) {
      console.error('Qwen JSON generation error:', error);
      return {};
    }
  }
}
