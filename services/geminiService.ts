
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { QuizData, AgeGroup, ModuleRecord, FinancialReport, IntroData } from "../types";

// Initialize the Gemini client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = 'gemini-2.5-flash';
// Using the specified model for image generation
const imageModelId = 'gemini-2.5-flash-image';

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

export const generateIntroStory = async (
  nickname: string,
  ageGroup: AgeGroup,
  industry: string,
  avatarStyle: string
): Promise<IntroData> => {
  const ai = getAiClient();
  let promptContext = "";
  
  if (ageGroup === 'child') {
    promptContext = `用户是一个叫${nickname}的小冒险家。请生成一段约100字的奇幻故事开场。场景：迷雾森林的入口。语气：神秘但充满希望。`;
  } else if (ageGroup === 'teen') {
    promptContext = `用户是一个叫${nickname}的中学生。生成一段100字开场白。场景：喧闹的校园走廊，周围充满了物质诱惑和同伴压力。语气：青春、迷茫、渴望证明自己。`;
  } else {
    const ind = industry || "无名氏";
    promptContext = `
      RPG设定：赛博都市“华京市”。
      玩家：${nickname}，身份：${ind}。
      
      任务：
      生成一段120字的黑色电影(Film Noir)风格的开场旁白。
      
      内容要求：
      1. 环境描写：雨夜、霓虹灯、高耸入云的写字楼、拥挤的地铁、疲惫的眼神。
      2. 核心冲突：在这座渴望金钱的城市里，你是猎手还是猎物？
      3. 语气：冷峻、现实、充满张力。
      
      不要说“欢迎”，直接开始叙述。
    `;
  }

  const baseImageStyle = getStylePrompt(avatarStyle);
  // Simplified prompt for better success rate
  const imagePrompt = `${baseImageStyle} A lone figure standing in a city street, looking at a distant light, atmospheric, cinematic composition, high quality.`;

  let storyText = "";
  let imageUrl: string | null = null;

  try {
    // We run these sequentially to better handle individual errors
    try {
      const textResponse = await ai.models.generateContent({
        model: modelId,
        contents: promptContext,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { story: { type: Type.STRING } }
          }
        }
      });
      const json = JSON.parse(textResponse.text || "{}");
      storyText = json.story || `华京市的雨从来不停，${nickname}。欢迎来到这里...`;
    } catch (e) {
      console.warn("Intro Text Error, using fallback", e);
      storyText = `系统连接中... ${nickname}，华京市的大门正在打开。准备好迎接挑战了吗？`;
    }

    try {
      const imageResponse = await ai.models.generateContent({
        model: imageModelId,
        contents: { parts: [{ text: imagePrompt }] },
      });
      imageUrl = extractImageFromResponse(imageResponse);
    } catch (e) {
      console.warn("Intro Image Error", e);
    }

  } catch (e) {
    console.error("Intro generation fatal error", e);
  }

  return { story: storyText || `欢迎来到华京市，${nickname}。`, imageUrl };
};

export const generateLevelImage = async (
  levelTitle: string,
  levelDesc: string,
  avatarStyle: string,
  narrativeContext: string
): Promise<string | null> => {
  const ai = getAiClient();
  const baseStyle = getStylePrompt(avatarStyle);
  
  const contextSummary = narrativeContext.slice(-200); 
  const prompt = `
    ${baseStyle} 
    Environment art for a level titled "${levelTitle}". 
    Context from story: ${contextSummary}.
    Atmospheric background, no text, cinematic lighting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: imageModelId,
      contents: { parts: [{ text: prompt }] },
    });

    return extractImageFromResponse(response);
  } catch (e) {
    console.error("Level image generation error", e);
  }
  return null;
};

export const createAssistantChat = (ageGroup: AgeGroup, nickname: string, industry?: string): Chat => {
  const ai = getAiClient();
  let systemInstruction = "";
  if (ageGroup === 'child') systemInstruction = `你是“魔法书精灵”。用户是${nickname}。用讲故事的语气回答金钱问题。`;
  else if (ageGroup === 'teen') systemInstruction = `你是“神秘学长”。用户是${nickname}。说话很酷，有点叛逆，但三观很正。`;
  else systemInstruction = `你是华京市的“影子顾问”。用户是${nickname}。你说话像《教父》里的军师，冷静、客观、甚至有点冷酷。分析利弊时，不仅看钱，还要看人性、风险和局势。`;

  return ai.chats.create({ model: modelId, config: { systemInstruction } });
};

// FALLBACK DATA for offline mode or API limits
const getFallbackQuiz = (moduleName: string): QuizData => {
  return {
    scenario: "通讯连接不稳定，启用了本地应急预案。",
    question: `在"${moduleName}"的情况下，你该如何抉择？`,
    options: [
      `应对${moduleName}的保守方案，规避风险`,
      `应对${moduleName}的激进方案，追求高回报`,
      `应对${moduleName}的平衡方案，稳步前行`
    ],
    outcomes: [
      "你选择了安全，虽然错失了机会，但也避免了潜在的损失。",
      "你承担了巨大风险，虽然获得了短期收益，但也埋下了隐患。",
      "专业的建议让你看清了局势，做出了平衡的选择。"
    ],
    correctIndex: 2,
    explanation: "在信息不明确时，寻求专业建议或保持中庸通常是生存之道。"
  };
};

export const generateModuleQuiz = async (
  levelName: string, 
  moduleName: string, 
  levelId: number, 
  ageGroup: AgeGroup,
  userProfile?: any,
  narrativeContext: string = ""
): Promise<QuizData> => {
  const ai = getAiClient();
  const industry = userProfile?.industry || "普通职员";
  
  let systemInstruction = `
    你是一个沉浸式文字冒险游戏的 Game Master (GM)。
    
    游戏背景：华京市（一个充满机遇与陷阱的现实主义都市）。
    当前章节：${levelName} - ${moduleName}。
    玩家身份：${industry}。
    
    【玩家当前状态/剧情上下文】
    "${narrativeContext}"
    
    【核心指令】
    请生成一个“命运抉择时刻”。
    **根据玩家之前的剧情上下文调整难度和诱惑。**
    
    【关键要求】
    1. **制造信息差**：不要让选项看起来一眼就能分出好坏。
    2. **打乱顺序**：生成的 3 个选项必须打乱顺序。
    3. **叙事性结果**：Outcomes 必须紧扣剧情。
    
    【JSON输出格式】
    - correctIndex: 代表最符合财商智慧（长期利益/风险控制）的选项索引 (0-2)。
  `;

  if (ageGroup !== 'adult') {
    systemInstruction = `Create a fun RPG story choice for a ${ageGroup} about ${moduleName}. Adapt to context: ${narrativeContext}. Make choices tricky but fun.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: systemInstruction + "\n生成 JSON 数据。",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenario: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            outcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["scenario", "question", "options", "outcomes", "correctIndex"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text) as QuizData;
  } catch (error) {
    console.error("Quiz Generation Error, using fallback:", error);
    return getFallbackQuiz(moduleName);
  }
};

export const updateNarrativeContext = async (
  currentContext: string,
  scenario: string,
  choice: string,
  outcome: string,
  isOptimal: boolean
): Promise<string> => {
  const ai = getAiClient();
  const prompt = `
    Update the story summary based on the latest turn.
    Current Story: "${currentContext}"
    New Event: "${scenario}". Choice: "${choice}". Result: "${outcome}".
    Task: Write a 1-sentence summary. Noir style.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    const newEntry = response.text?.trim();
    return (currentContext + " " + newEntry).slice(-1000);
  } catch (e) {
    return currentContext;
  }
};

// Fallback report generator
const getFallbackReport = (history: Record<string, ModuleRecord>, age: number): FinancialReport => {
  const records = Object.values(history);
  const optimalCount = records.filter(r => r.isOptimal).length;
  const score = Math.round((optimalCount / (records.length || 1)) * 100);
  
  return {
    personaTitle: "坚韧的生存者 (离线评估)",
    analysis: "由于与华京市中央数据库的连接不稳定，这是基于你历史行为的本地评估。你表现出了在不确定环境中的生存能力。你做出了自己的选择，并承担了相应的后果。",
    advice: "现金为王。在信息不足时，保守的策略往往能让你活得更久。待网络恢复后，可尝试重新进行深度分析。",
    score: Math.max(60, score)
  };
};

export const generateUserReport = async (history: Record<string, ModuleRecord>, userAge: number): Promise<FinancialReport> => {
  const ai = getAiClient();
  const records = Object.values(history);
  const historySummary = records.map((r, i) => `抉择${i+1}: ${r.quizData.question.substring(0,10)}... 选了:${r.quizData.options[r.selectedOptionIndex]} (IsOptimal: ${r.isOptimal})`).join("\n");

  const prompt = `基于以下游戏记录，为${userAge}岁的玩家生成一份“华京市生存评估报告”。风格犀利、黑色幽默。给出评分(0-100)。\n${historySummary}`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personaTitle: { type: Type.STRING },
            analysis: { type: Type.STRING },
            advice: { type: Type.STRING },
            score: { type: Type.INTEGER }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}") as FinancialReport;
  } catch (e) {
    console.error("Report Generation Error:", e);
    // Return fallback report instead of throwing, so the UI can display something
    return getFallbackReport(history, userAge);
  }
};
