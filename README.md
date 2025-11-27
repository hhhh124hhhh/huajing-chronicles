# 🏙️ 华京市风云录 (Huajing City Chronicles)

> **"在这座霓虹闪烁的城市里，金钱是血液，但人性才是脊梁。"**

## 📖 项目简介

**华京市风云录** 最初是一个由 AI 驱动的财商教育游戏，但随着开发的深入，它演变成了一个关于**人性、抉择与生存**的文字冒险模拟器（RPG）。

不同于传统的“大富翁”式游戏，本项目利用 **Google Gemini API** 和 **国内AI API** 的强大生成能力，构建了一个动态、残酷且充满不确定性的现实世界。在这里，玩家不仅要计算投资回报率，更要在道德边缘游走，在欲望与理智之间博弈。

## 🎮 核心理念：不仅是财商，更是人性

在这个游戏中，由于 AI 提供的实时剧情生成，没有两次冒险是完全相同的。

*   **童年篇 (Fantasy)：** 关于诱惑与延迟满足。是吃掉眼前的毒糖果，还是为过冬储备？
*   **少年篇 (Social)：** 关于虚荣与自我认同。是透支未来购买限量球鞋融入圈子，还是在孤独中积累资本？
*   **成年篇 (Noir/Cyberpunk)：** 关于生存与责任。
    *   当裁员的名单递到你面前；
    *   当至亲躺在ICU需要高昂的手术费；
    *   当内幕交易的机会摆在手边；
    *   **你，会怎么选？**

## ✨ 核心功能

### 1. 多重宇宙视觉体验 (Visual Styles)
游戏支持多种由 AI 实时渲染的视觉风格，决定了你眼中的世界模样：
*   **🌆 赛博霓虹 (Cyberpunk):** 高科技低生活，霓虹雨夜，数据洪流。
*   **🕵️‍♂️ 暗黑侦探 (Noir):** 黑白光影，压抑，冷峻的现实主义。
*   **🎨 极乐油画 (Oil):** 厚重的笔触，充满隐喻与情绪的宣泄。
*   **☁️ 新海诚风 (Anime):** 唯美却孤独的都市传说。

### 2. AI 驱动的无限剧本 (Infinite Narrative)
*   **动态关卡：** 利用 AI 模型，根据玩家当前的职业（如金融、科技、体制内）和历史选择，实时生成剧情抉择。
*   **环境渲染：** 利用 AI 图像生成能力，实时生成符合当前剧情氛围的背景图。
*   **容错机制：** 即使网络波动，内置的本地降级策略也能保证游戏流畅进行。

### 3. 影子顾问 (Shadow Consultant)
这就不是一个简单的 Chatbot。它是一个基于 RAG (Retrieval-Augmented Generation) 理念设计的 AI 伴侣。
*   它知道你刚才在游戏中经历了什么（“听说你刚才为了赚快钱加了5倍杠杆？”）。
*   它会用符合你年龄段的语气（魔法精灵、叛逆学长、或冷酷的华京市军师）与你对话。

### 4. 完整的生涯系统
*   **人格侧写：** 游戏结束时，AI 会根据你的所有决策，生成一份犀利的心理分析报告。
*   **成就系统：** 记录你的每一个高光时刻或惨痛教训。

## 🛠️ 技术栈

*   **Frontend:** React 19, TypeScript
*   **Styling:** Tailwind CSS (实现了复杂的动态主题切换)
*   **AI Engine:** 
    *   Google GenAI SDK (`@google/genai`)
        *   Text Generation: `gemini-2.5-flash`
        *   Image Generation: `gemini-2.5-flash-image`
    *   国内AI API
        *   百度文心一言 (Ernie)
        *   阿里云通义千问 (Qwen)
        *   字节跳动豆包 (Doubao)
*   **Audio:** Web Audio API (无素材依赖，程序化生成音效)
*   **State Management:** React Hooks + LocalStorage Persistence

## 🚀 快速开始

### 前置要求
你需要以下任一 API Key：
*   Google Gemini API Key
*   国内AI平台 API Key（百度文心一言、阿里云通义千问、字节跳动豆包）

### 安装与运行

```bash
# 1. 克隆项目
git clone https://github.com/hhhh124hhhh/huajing-chronicles.git
cd huajing-chronicles

# 2. 安装依赖
npm install

### 3. 设置环境变量
1. 复制环境变量示例文件：
```bash
cp .env.example .env
```

2. 使用文本编辑器打开 `.env` 文件，根据需要配置 API 密钥：

**使用 Google Gemini API（默认）：**
```bash
# 指定AI提供商
VITE_AI_PROVIDER=gemini
# 获取 API 密钥：https://ai.google.dev/gemini-api/keys
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

**使用国内AI API：**

**百度文心一言：**
```bash
# 指定AI提供商
VITE_AI_PROVIDER=ernie
# 获取 API 密钥：https://cloud.baidu.com/product/wenxinworkshop
VITE_ERNIE_API_KEY=your_ernie_api_key_here
```

**阿里云通义千问：**
```bash
# 指定AI提供商
VITE_AI_PROVIDER=qwen
# 获取 API 密钥：https://dashscope.aliyun.com/
VITE_QWEN_API_KEY=your_qwen_api_key_here
```

**字节跳动豆包：**
```bash
# 指定AI提供商
VITE_AI_PROVIDER=doubao
# 获取 API 密钥：https://ark.bytedance.com/
VITE_DOUBAO_API_KEY=your_doubao_api_key_here
```

3. 保存并关闭文件

**注意：** `.env` 文件包含敏感信息，请确保不要将其提交到版本控制系统（项目已在 `.gitignore` 中排除了此文件）。

# 4. 启动
npm run dev 
```

## ⚠️ 玩前必读

> "华京市没有标准答案。有些选择虽然能带来金钱上的最优解，但可能会让你在深夜里辗转反侧。这才是游戏的真实意图——**审视你的内心**。"

---

Made with ❤️ & 🤖 using React + AI
