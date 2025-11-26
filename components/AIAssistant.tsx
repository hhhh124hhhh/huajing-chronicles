
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare, Sparkles, User, Briefcase, Smile, Loader2, Terminal, ShieldAlert } from 'lucide-react';
import { UserProfile, ChatMessage, QuizData, Chat } from '../types';
import { createAssistantChat } from '../services/gameService';
import { audioService } from '../services/audioService';

interface AIAssistantProps {
  userProfile: UserProfile;
  currentQuiz?: QuizData | null;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ userProfile, currentQuiz }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userProfile && !chatRef.current) {
      chatRef.current = createAssistantChat(userProfile.ageGroup, userProfile.nickname, userProfile.industry);
      const greeting = `[加密连接建立] 身份确认：${userProfile.nickname}。\n我是你的影子顾问。在这里，没有所谓的问题，只有情报。请讲。`;
      setMessages([{ id: 'init', role: 'model', text: greeting }]);
    }
  }, [userProfile]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;
    
    const userText = input;
    setInput('');
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
    setIsTyping(true);
    audioService.playClick();

    try {
      let contextPrefix = "";
      if (currentQuiz) {
        contextPrefix = `[情报更新：当前剧本“${currentQuiz.scenario}”。面临抉择“${currentQuiz.question}”。选项：${currentQuiz.options.join(' / ')}。] 请基于此提供战术分析。用户讯息：`;
      }

      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: botMsgId, role: 'model', text: '', isStreaming: true }]);

      // 使用统一的sendMessage方法，不再依赖特定的streaming实现
      const fullText = await chatRef.current.sendMessage(contextPrefix + userText);
      
      setMessages(prev => prev.map(m => 
        m.id === botMsgId ? { ...m, text: fullText, isStreaming: false } : m
      ));
      audioService.playSuccess();
      
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: '通讯受到干扰。请重试。' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); audioService.playClick(); }}
        className={`
          fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12
          bg-slate-900 border border-purple-500/50 text-purple-400 hover:bg-slate-800
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        <Terminal size={24} />
      </button>

      <div 
        className={`
          fixed bottom-6 right-6 z-50 w-[90vw] md:w-96 h-[65vh] max-h-[600px] 
          bg-[#0a0a0a]/95 backdrop-blur-xl rounded-lg shadow-2xl flex flex-col overflow-hidden border border-purple-900/30
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-20 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between shrink-0 bg-slate-950 border-b border-white/5">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
              <div>
                <h3 className="font-bold text-sm text-slate-200 tracking-wider uppercase font-mono">影子顾问</h3>
                <p className="text-[10px] text-slate-500 font-mono">ENCRYPTED CHANNEL</p>
              </div>
           </div>
           <button 
             onClick={() => setIsOpen(false)}
             className="text-slate-500 hover:text-white transition-colors"
           >
             <X size={18} />
           </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div 
                 className={`
                   max-w-[85%] p-3 text-sm leading-relaxed font-sans
                   ${msg.role === 'user' 
                     ? 'bg-purple-900/40 text-purple-100 border border-purple-700/50 rounded-l-lg rounded-tr-lg' 
                     : 'bg-slate-800/60 text-slate-300 border border-slate-700/50 rounded-r-lg rounded-tl-lg shadow-sm'
                   }
                 `}
               >
                 {msg.role === 'model' && msg.text === '' && msg.isStreaming ? (
                    <span className="flex items-center gap-2 text-xs font-mono text-emerald-500">
                      <Loader2 size={12} className="animate-spin" /> DECODING...
                    </span>
                 ) : (
                    msg.text
                 )}
               </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="bg-slate-800/60 p-3 rounded-lg flex gap-1 items-center border border-slate-700/50">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping delay-75"></div>
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 bg-black/40 border-t border-white/5 shrink-0">
           {currentQuiz && (
             <div className="mb-2 px-2 text-[10px] text-amber-500/70 truncate flex items-center gap-1 font-mono">
               <ShieldAlert size={10} /> 正在分析: {currentQuiz.question.substring(0, 15)}...
             </div>
           )}
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSend(); }}
             className="flex gap-2"
           >
             <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="发送指令..."
               className="flex-1 bg-slate-900/50 text-slate-200 border border-slate-700 rounded-md px-4 py-2 text-sm placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-mono"
             />
             <button 
               type="submit"
               disabled={!input.trim() || isTyping}
               className={`
                 p-2.5 rounded-md text-slate-900 transition-all font-bold
                 ${!input.trim() || isTyping ? 'bg-slate-800 text-slate-600' : 'bg-purple-500 hover:bg-purple-400 text-black'}
               `}
             >
               {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
             </button>
           </form>
        </div>
      </div>
    </>
  );
};
