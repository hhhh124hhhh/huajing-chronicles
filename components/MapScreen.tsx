
import React, { useState, useEffect } from 'react';
import { Level, UserProfile, UserProgress, FinancialReport } from '../types';
import { Lock, Menu, Unlock } from 'lucide-react';
import { AchievementsModal } from './AchievementsModal';
import { audioService } from '../services/audioService';

interface MapScreenProps {
  levels: Level[];
  unlockedLevelMax: number;
  onLevelSelect: (level: Level) => void;
  completedModuleCount: number;
  userProfile: UserProfile;
  userProgress: UserProgress;
  onUpdateReport: (report: FinancialReport) => void;
  onResetProgress: () => void;
  onCheatUnlock: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ 
  levels,
  unlockedLevelMax, 
  onLevelSelect,
  completedModuleCount,
  userProfile,
  userProgress,
  onUpdateReport,
  onResetProgress,
  onCheatUnlock
}) => {
  const [showAchievements, setShowAchievements] = useState(false);
  
  // Cheat Code State
  const [clickCount, setClickCount] = useState(0);
  const [showCheatToast, setShowCheatToast] = useState(false);

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 1000); // Reset if idle for 1s
      return () => clearTimeout(timer);
    }
  }, [clickCount]);

  const handleHeaderClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount === 5) {
        onCheatUnlock();
        setShowCheatToast(true);
        setTimeout(() => setShowCheatToast(false), 3000);
        return 0;
      }
      return newCount;
    });
  };
  
  return (
    <div className="min-h-screen bg-slate-950 pb-20 relative font-sans text-slate-200">
      
      <AchievementsModal 
        isOpen={showAchievements} 
        onClose={() => setShowAchievements(false)} 
        progress={userProgress}
        onUpdateReport={onUpdateReport}
        onResetProgress={onResetProgress}
      />

      {/* Cheat Code Toast */}
      {showCheatToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-emerald-900/90 text-emerald-100 px-6 py-3 rounded-md border border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <Unlock size={18} />
          <div>
            <div className="font-bold font-mono text-sm uppercase tracking-widest">GOD MODE ACTIVATED</div>
            <div className="text-[10px] opacity-80">All levels unlocked. System overridden.</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
         <div className="cursor-pointer select-none" onClick={handleHeaderClick}>
            <h1 className="text-lg font-bold text-white tracking-widest uppercase font-serif">
              华京市 <span className="text-purple-500 text-xs align-top">V 1.0</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">当前身份: {userProfile.nickname}</p>
         </div>
         
         <button 
           onClick={() => { audioService.playClick(); setShowAchievements(true); }}
           className="w-10 h-10 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center hover:bg-slate-800 transition-colors"
         >
           <Menu size={18} className="text-slate-400" />
         </button>
      </div>

      {/* Main Map Container */}
      <div className="max-w-md mx-auto py-10 px-6 relative min-h-[800px]">
         
         {/* Connecting Line */}
         <div className="absolute left-1/2 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-purple-900/50 to-transparent -translate-x-1/2 z-0"></div>

         <div className="space-y-16 relative z-10">
            {levels.map((level, index) => {
               const isLocked = level.id > unlockedLevelMax;
               const isActive = level.id === unlockedLevelMax;
               const isCompleted = level.id < unlockedLevelMax;

               return (
                  <div 
                    key={level.id}
                    onClick={() => !isLocked && onLevelSelect(level)}
                    className={`
                      relative group cursor-pointer transition-all duration-500
                      ${isLocked ? 'opacity-40 grayscale' : 'opacity-100'}
                      ${isActive ? 'scale-105' : 'scale-100'}
                    `}
                  >
                     {/* Hexagon Node */}
                     <div className="flex flex-col items-center justify-center text-center gap-4">
                        
                        <div className={`
                           w-24 h-24 relative flex items-center justify-center transition-all duration-500
                           ${isActive ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' : ''}
                        `}>
                           {/* Hexagon Shape CSS */}
                           <div className={`
                              absolute inset-0 clip-path-hexagon transition-colors duration-500
                              ${isLocked ? 'bg-slate-800' : isCompleted ? 'bg-slate-800 border-2 border-slate-600' : 'bg-gradient-to-br from-purple-900 to-slate-900'}
                           `} style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                           
                           {/* Inner Content */}
                           <div className="relative z-10">
                              {isLocked ? (
                                 <Lock size={24} className="text-slate-600" />
                              ) : (
                                 <span className="text-3xl font-black text-white/90 font-serif">{index + 1}</span>
                              )}
                           </div>
                           
                           {/* Active Pulse Ring */}
                           {!isLocked && isActive && (
                              <div className="absolute -inset-2 border border-purple-500/30 animate-ping" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}></div>
                           )}
                        </div>

                        {/* Text Label */}
                        <div className={`transition-all duration-300 ${isActive ? 'translate-y-0' : 'translate-y-0'}`}>
                           <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 mb-1">
                              {level.title}
                           </div>
                           <h3 className="text-lg font-bold text-slate-200 font-serif tracking-wide group-hover:text-white group-hover:glow-text">
                              {level.subtitle}
                           </h3>
                           {!isLocked && isActive && (
                              <div className="mt-2 text-xs text-slate-500 font-mono">
                                 [ 进行中 ]
                              </div>
                           )}
                           {isCompleted && (
                              <div className="mt-2 text-xs text-emerald-600 font-mono">
                                 [ 已归档 ]
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               );
            })}
         </div>

      </div>
    </div>
  );
};
