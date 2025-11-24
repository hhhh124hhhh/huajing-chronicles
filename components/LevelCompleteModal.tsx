
import React, { useEffect, useState } from 'react';
import { FileCheck, ArrowRight, Map, Fingerprint, Stamp } from 'lucide-react';

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelNumber: number;
  levelTitle: string;
  xpGained: number;
  onNextLevel: () => void;
  onClose: () => void;
  isMaxLevel: boolean;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  levelNumber,
  levelTitle,
  xpGained,
  onNextLevel,
  onClose,
  isMaxLevel
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl font-sans text-slate-200">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 pointer-events-none"></div>

      <div 
        className={`
          w-full max-w-lg rounded-sm border border-slate-700 bg-[#0f1115] shadow-[0_0_50px_rgba(0,0,0,0.8)] relative transform transition-all duration-700 overflow-hidden
          ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'}
        `}
      >
        {/* Top Secret Stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-70"></div>

        {/* Header */}
        <div className="p-8 pb-0 text-center relative">
           <div className="inline-block border-2 border-slate-600 p-4 rounded-full mb-6 relative group">
             <div className="absolute inset-0 border border-slate-500 rounded-full animate-ping opacity-20"></div>
             <FileCheck size={40} className="text-slate-200" />
           </div>
           
           <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase font-serif mb-2">
             {isMaxLevel ? "档案封存" : "调查完成"}
           </h2>
           <p className="text-slate-500 text-xs tracking-widest uppercase">
             CASE FILE #{levelNumber} — EVIDENCE SECURED
           </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* Result Card */}
          <div className="bg-slate-900/50 border border-slate-700 p-6 relative">
            {/* Stamp Effect */}
            <div className="absolute -right-4 -top-4 rotate-12 border-4 border-emerald-700/50 p-2 rounded text-emerald-700/50 font-black text-xl uppercase tracking-widest pointer-events-none select-none animate-in zoom-in duration-500 delay-300">
               <div className="border border-emerald-700/50 px-2 py-1">CLEARED</div>
            </div>

            <div className="text-center space-y-1">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">当前章节</div>
              <h3 className="text-xl font-bold text-slate-200 font-serif">{levelTitle}</h3>
            </div>
            
            <div className="my-6 border-t border-slate-800"></div>

            <div className="flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-slate-800 flex items-center justify-center rounded text-slate-400">
                   <Fingerprint size={20} />
                 </div>
                 <div className="text-left">
                   <div className="text-[10px] text-slate-500 uppercase font-bold">情报价值</div>
                   <div className="text-lg font-mono text-emerald-400">+{xpGained} XP</div>
                 </div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">状态更新</div>
                  <div className="text-lg font-serif italic text-purple-400">Context Updated</div>
               </div>
            </div>
          </div>

          <p className="text-slate-400 text-sm text-center leading-relaxed font-serif italic">
            "{isMaxLevel 
              ? "所有的线索都已拼凑完成，你已洞悉这座城市的运行法则。" 
              : "你的每一个选择都已记录在案。城市的阴影在涌动，下一场博弈即将开始。"}"
          </p>

          <div className="flex flex-col gap-3 pt-2">
            {!isMaxLevel && (
              <button 
                onClick={onNextLevel}
                className="group w-full py-4 bg-slate-100 hover:bg-white text-black rounded-sm font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              >
                解密下一章 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            <button 
              onClick={onClose}
              className="w-full py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-sm font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              <Map size={16} /> 返回情报网
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
