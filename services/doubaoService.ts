import { AIService } from './aiService';

export class DoubaoService implements AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_DOUBAO_API_KEY || '';
    // 使用代理路径，避免跨域问题
    this.baseUrl = '/api/ark';
  }

  async generateText(prompt: string): Promise<string> {
    try {
      // 豆包文本生成API调用 - 匹配火山引擎API格式
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'doubao-seed-1-6-251015',
          max_completion_tokens: 65535,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                }
              ]
            }
          ],
          reasoning_effort: 'medium'
        })
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Doubao text generation error:', error);
      return '';
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      // 豆包图像生成API调用 - 使用正确的API端点和模型
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'doubao-seedream-4-0-250828',
          prompt: prompt,
          sequential_image_generation: 'disabled',
          response_format: 'url',
          size: '2K',
          stream: false,
          watermark: true
        })
      });

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0].url;
      }
      return null;
    } catch (error) {
      console.error('Doubao image generation error:', error);
      // 生图失败时返回null，让游戏使用默认图像
      return null;
    }
  }

  createChat(systemInstruction: string): any {
    // 豆包的聊天功能实现
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
      const jsonPrompt = `${prompt}\n\n请严格按照以下JSON schema格式输出结果：\n${JSON.stringify(schema, null, 2)}\n\n输出时只包含JSON内容，不要包含其他任何文字，不要添加任何解释或说明。`;
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'doubao-seed-1-6-251015',
          max_completion_tokens: 65535,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: jsonPrompt
                }
              ]
            }
          ],
          reasoning_effort: 'medium'
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        // 清理内容，只保留JSON部分
        const cleanedContent = this.cleanJSONContent(content);
        return JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('Failed to parse Doubao JSON response:', parseError);
        console.error('Raw content:', content);
        return {};
      }
    } catch (error) {
      console.error('Doubao JSON generation error:', error);
      return {};
    }
  }

  // 清理JSON内容，处理豆包API可能返回的额外文本
  private cleanJSONContent(content: string): string {
    // 移除可能的前缀和后缀文本
    let cleaned = content.trim();
    
    // 移除可能的Markdown代码块标记
    cleaned = cleaned.replace(/^```json\n/, '');
    cleaned = cleaned.replace(/\n```$/, '');
    cleaned = cleaned.replace(/^```\n/, '');
    cleaned = cleaned.replace(/\n```$/, '');
    
    // 尝试找到JSON的开始和结束位置
    const startIndex = cleaned.indexOf('{');
    const endIndex = cleaned.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
      cleaned = cleaned.substring(startIndex, endIndex + 1);
    }
    
    return cleaned;
  }
}
