import { AIService } from './aiService';

export class ErnieService implements AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_ERNIE_API_KEY || '';
    // 使用代理路径，避免跨域问题
    this.baseUrl = '/api/ernie';
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions_pro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'ernie-4.0',
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      const data = await response.json();
      return data.result || '';
    } catch (error) {
      console.error('Ernie text generation error:', error);
      return '';
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'ernie-vilg-v2',
          prompt: prompt,
          n: 1,
          size: '1024x1024'
        })
      });

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0].url;
      }
      return null;
    } catch (error) {
      console.error('Ernie image generation error:', error);
      return null;
    }
  }

  createChat(systemInstruction: string): any {
    // 文心一言的聊天功能实现
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
      
      const response = await fetch(`${this.baseUrl}/chat/completions_pro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'ernie-4.0',
          messages: [
            { role: 'user', content: jsonPrompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      try {
        return JSON.parse(data.result || '{}');
      } catch (parseError) {
        console.error('Failed to parse Ernie JSON response:', parseError);
        return {};
      }
    } catch (error) {
      console.error('Ernie JSON generation error:', error);
      return {};
    }
  }
}
