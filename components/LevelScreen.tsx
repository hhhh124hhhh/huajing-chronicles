
import React, { useState, useEffect } from 'react';
import { Level, GameModule, QuizData, ModuleRecord, UserProfile } from '../types';
import { ArrowLeft, Check, ArrowRight, Image as ImageIcon, Disc, FileText, Lock, Brush, Fingerprint, Zap } from 'lucide-react';
import * as Icons from 'lucide-react';
import { QuizModal } from './QuizModal';
import { generateModuleQuiz, generateLevelImage } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { AIAssistant } from './AIAssistant';

interface LevelScreenProps {
  level: Level;
  onBack: () => void;
  completedModuleIds: string[];
  moduleHistory: Record<string, ModuleRecord>;
  onModuleComplete: (moduleId: string, quizData: QuizData, selectedIndex: number) => void;
  userProfile: UserProfile;
  narrativeContext: string;
}

export const LevelScreen: React.FC<LevelScreenProps> = ({ 
  level, 
  onBack, 
  completedModuleIds, 
  moduleHistory, 
  onModuleComplete,
  userProfile,
  narrativeContext
}) => {
  const [selectedModule, setSelectedModule] = useState<GameModule | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [savedSelection, setSavedSelection] = useState<number | null>(null);
  const [levelImage, setLevelImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  const style = userProfile.avatarStyle || 'cyberpunk';

  useEffect(() => {
    const loadLevelImage = async () => {
      setLoadingImage(true);
      try {
        const img = await generateLevelImage(level.title, level.description, userProfile.avatarStyle, narrativeContext);
        if (img) setLevelImage(img);
      } catch (e) {
        console.error("Failed to load level image");
      } finally {
        setLoadingImage(false);
      }
    };
    loadLevelImage();
  }, [level.id, userProfile.avatarStyle]);

  const handleModuleClick = async (module: GameModule) => {
    audioService.playClick();
    setSelectedModule(module);
    
    const isCompleted = completedModuleIds.includes(module.id);

    if (isCompleted && moduleHistory[module.id]) {
      const record = moduleHistory[module.id];
      setQuizData(record.quizData);
      setSavedSelection(record.selectedOptionIndex);
      setIsLoadingQuiz(false);
    } else {
      setSavedSelection(null);
      setIsLoadingQuiz(true);
      setQuizData(null); 
      try {
        const data = await generateModuleQuiz(
            level.title, 
            module.name, 
            level.id, 
            userProfile.ageGroup, 
            userProfile,
            narrativeContext
        );
        setQuizData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingQuiz(false);
      }
    }
  };

  const handleDecisionMade = (selectedIndex: number) => {
    if (selectedModule && quizData) {
        onModuleComplete(selectedModule.id, quizData, selectedIndex);
    }
  };

  const handleQuizClose = () => {
    setSelectedModule(null);
    setQuizData(null);
    setSavedSelection(null);
  };

  const renderIcon = (iconName: string, size: number = 24) => {
    try {
      // @ts-ignore
      const IconComponent = Icons[iconName];
      if (IconComponent) return <IconComponent size={size} strokeWidth={1.5} />;
    } catch (e) { console.warn(e); }
    return <Icons.HelpCircle size={size} strokeWidth={1.5} />;
  };

  // --- STYLE RENDERERS ---

  const renderModuleItem = (module: GameModule, index: number, isCompleted: boolean) => {
    const commonClick = () => handleModuleClick(module);
    
    // --- CYBERPUNK STYLE: Skewed Data Bars ---
    if (style === 'cyberpunk') {
      return (
        <button 
          key={module.id}
          onClick={commonClick}
          onMouseEnter={() => audioService.playHover()}
          className={`
            group w-full relative h-28 mb-6 flex items-center transition-all duration-300 transform
            border-l-4 overflow-visible text-left
            ${isCompleted 
              ? 'border-slate-700 bg-slate-900/50 opacity-60' 
              : 'border-[var(--accent-color)] bg-black/60 hover:translate-x-4'
            }
          `}
        >
          {/* Main Bar Background */}
          <div className={`absolute inset-0 skew-x-[-12deg] border border-white/10 ${isCompleted ? 'bg-slate-900' : 'bg-black/80 group-hover:bg-[var(--accent-color)]/10'}`}></div>
          
          {/* Scanning Line */}
          {!isCompleted && <div className="absolute top-0 bottom-0 left-[-100%] w-20 bg-gradient-to-r from-transparent via-[var(--accent-color)] to-transparent skew-x-[-12deg] opacity-20 group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>}

          <div className="relative flex items-center w-full px-8 gap-6 z-10">
            {/* Number ID */}
            <div className="flex flex-col items-center justify-center w-12 border-r border-white/10 pr-4">
               <span className="text-[10px] text-[var(--text-secondary)] font-mono">ID</span>
               <span className={`text-2xl font-mono font-bold ${isCompleted ? 'text-slate-600' : 'text-[var(--accent-color)]'}`}>
                 0{index + 1}
               </span>
            </div>
            
            {/* Icon Box */}
            <div className={`
               w-12 h-12 flex items-center justify-center transform skew-x-[-12deg] border
               ${isCompleted 
                  ? 'border-slate-700 text-slate-600 bg-slate-900' 
                  : 'border-[var(--accent-color)] text-[var(--accent-color)] bg-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
               }
            `}>
              <div className="skew-x-[12deg]">
                 {isCompleted ? <Check size={20} /> : renderIcon(module.icon, 20)}
              </div>
            </div>

            <div className="flex-1">
              <h3 className={`font-mono text-lg font-bold uppercase tracking-wider ${isCompleted ? 'text-slate-500 line-through' : 'text-white group-hover:text-[var(--accent-color)] group-hover:glitch-hover'}`}>
                {module.name}
              </h3>
              <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-80 uppercase tracking-widest mt-1">
                {isCompleted ? '>> DATA SECURED <<' : `>> ENCRYPTED PACKET ${index+1}`}
              </p>
            </div>
            
            {!isCompleted && (
               <div className="hidden md:flex items-center gap-2 text-[var(--accent-color)] font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>ACCESS</span> <ArrowRight size={14} />
               </div>
            )}
          </div>
        </button>
      );
    }

    // --- NOIR STYLE: Confidential Case Files ---
    if (style === 'noir') {
      return (
        <button 
          key={module.id}
          onClick={commonClick}
          onMouseEnter={() => audioService.playHover()}
          className={`
             group w-full relative mb-[-10px] pt-8 pb-10 px-8 flex items-center text-left transition-all duration-300
             bg-[#e5e5e5] border border-slate-400 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] hover:-translate-y-4 hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)]
             ${isCompleted ? 'z-0 grayscale contrast-75 bg-[#d4d4d4]' : 'z-10'}
          `}
          style={{ transform: `rotate(${index % 2 === 0 ? '-1deg' : '1deg'})` }}
        >
          {/* Paper Texture */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>

          {/* Folder Tab */}
          <div className="absolute top-0 left-4 w-32 h-6 bg-[#d1d1d1] border-t border-x border-slate-400 rounded-t-md flex items-center justify-center">
             <span className="text-[10px] font-bold font-serif uppercase tracking-widest text-slate-800">CASE #{100 + index}</span>
          </div>

          {/* Stamp */}
          {isCompleted && (
             <div className="absolute right-10 top-4 rotate-[-15deg] border-4 border-red-800 text-red-800 px-4 py-1 font-black text-xl uppercase opacity-60 mix-blend-multiply z-20">
                CLOSED
             </div>
          )}

          <div className={`mr-6 relative z-10 p-3 border-2 ${isCompleted ? 'border-slate-500 text-slate-500' : 'border-black text-black'}`}>
             {renderIcon(module.icon, 24)}
          </div>

          <div className="flex-1 relative z-10">
            <h3 className={`font-serif text-2xl font-bold tracking-tight text-black mb-1 ${isCompleted ? 'text-slate-600' : 'group-hover:underline decoration-2 underline-offset-4'}`}>
              {module.name}
            </h3>
            <p className="font-serif text-sm text-slate-700 italic border-l-2 border-slate-400 pl-3">
              {module.description.substring(0, 50)}...
            </p>
          </div>

          <Fingerprint className={`absolute right-4 bottom-4 text-slate-300 w-16 h-16 opacity-50 ${!isCompleted ? 'group-hover:opacity-100' : ''}`} />
        </button>
      );
    }

    // --- OIL STYLE: Framed Canvas ---
    if (style === 'oil') {
      return (
        <button 
          key={module.id}
          onClick={commonClick}
          onMouseEnter={() => audioService.playHover()}
          className={`
            group w-full relative p-6 mb-8 flex items-center text-left transition-all duration-500
            bg-[#292524] border-[6px] shadow-2xl
            ${isCompleted 
              ? 'border-[#44403c] opacity-60 scale-95' 
              : 'border-[#78350f] hover:scale-[1.02] hover:border-amber-600'
            }
          `}
        >
          {/* Canvas Texture Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
          
          {/* Gold Inlay */}
          <div className="absolute inset-[4px] border border-[#a8a29e] opacity-20 pointer-events-none"></div>

          <div className="mr-8 relative shrink-0">
             <div className="absolute -inset-4 bg-amber-900/40 blur-xl rounded-full"></div>
             <div className={`w-16 h-16 flex items-center justify-center rounded-full border-2 ${isCompleted ? 'border-[#57534e] text-[#57534e] bg-[#1c1917]' : 'border-amber-700 bg-[#451a03] text-amber-500 shadow-inner'}`}>
                {renderIcon(module.icon, 28)}
             </div>
          </div>

          <div className="flex-1 z-10">
            <h3 className="font-serif text-xl font-bold text-[#e7e5e4] group-hover:text-amber-200 transition-colors tracking-wide">
              {module.name}
            </h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-amber-800 to-transparent my-3 group-hover:w-full transition-all duration-700"></div>
            <p className="font-serif text-sm text-[#a8a29e] italic leading-relaxed">
              {module.description}
            </p>
          </div>

          {!isCompleted && <Brush size={20} className="text-amber-600 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
        </button>
      );
    }

    // --- ANIME / DEFAULT STYLE: Floating Glass Bubbles ---
    return (
      <button 
        key={module.id} 
        onClick={commonClick}
        onMouseEnter={() => audioService.playHover()}
        className={`
          group w-full relative overflow-hidden p-6 md:p-8 flex items-center gap-6 text-left transition-all duration-300
          border card-glass rounded-3xl backdrop-blur-xl mb-4
          ${isCompleted 
            ? 'opacity-60 bg-slate-900/30 border-white/5' 
            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-sky-300/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)] hover:-translate-y-1'
          }
        `}
      >
        {/* Shine effect */}
        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine" />

        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[var(--accent-color)] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>

        <div 
          className={`
            relative z-10 w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 shrink-0 shadow-lg
            ${isCompleted 
               ? 'bg-slate-800/50 text-slate-500' 
               : 'bg-gradient-to-br from-white/20 to-white/5 text-white border border-white/20 group-hover:scale-110'
            }
          `}
        >
          {isCompleted ? <Check size={24} /> : renderIcon(module.icon, 24)}
        </div>

        <div className="relative z-10 flex-1">
           <div className="flex items-center justify-between mb-1">
              <h3 className={`text-lg font-bold font-sans tracking-wide ${isCompleted ? 'text-slate-400' : 'text-white'}`}>
                {module.name}
              </h3>
              {!isCompleted && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-sky-200 border border-white/10">Active</span>}
           </div>
          <p className={`text-sm font-medium leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-sky-100/80'}`}>
            {module.description}
          </p>
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans transition-colors duration-500">
      
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20 transition-colors duration-700"
        style={{ background: `radial-gradient(circle at 50% 0%, ${level.colors.button} 0%, transparent 70%)` }}
      ></div>

      {/* Level Header Image Banner */}
      <div className={`relative w-full overflow-hidden shrink-0 border-b border-white/10 transition-all ${style === 'noir' ? 'h-56 border-b-4 border-black' : 'h-64 md:h-80'}`}>
         {loadingImage ? (
           <div className="w-full h-full bg-[var(--bg-primary)] flex flex-col items-center justify-center animate-pulse gap-2">
              <ImageIcon className="text-slate-700 w-12 h-12" />
              <span className="text-[10px] text-[var(--text-secondary)] font-mono uppercase">Decoding Environment...</span>
           </div>
         ) : levelImage ? (
           <>
             <img src={levelImage} alt="Level Atmosphere" className={`w-full h-full object-cover animate-in fade-in duration-1000 ${style === 'noir' ? 'grayscale contrast-125 sepia-[.2]' : 'opacity-80'}`} />
             <div className={`absolute inset-0 ${style === 'cyberpunk' ? 'bg-black/50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%]' : 'bg-gradient-to-b from-[var(--bg-primary)]/40 via-transparent to-[var(--bg-primary)]'}`}></div>
           </>
         ) : (
           <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <span className="text-slate-600 font-mono text-xs">VISUAL DATA CORRUPTED</span>
           </div>
         )}
         
         <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
           <button 
             onClick={() => { audioService.playClick(); onBack(); }}
             className={`p-3 rounded-full text-white transition-all backdrop-blur-md ${style === 'cyberpunk' ? 'bg-black border border-[var(--accent-color)] hover:bg-[var(--accent-color)] hover:text-black' : 'bg-black/40 hover:bg-black/60 border border-white/10'}`}
           >
             <ArrowLeft size={20} />
           </button>
         </div>

         <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20">
            <div className="max-w-4xl mx-auto">
                <h1 className={`text-xs font-bold uppercase tracking-[0.3em] mb-2 shadow-black drop-shadow-md inline-block px-2 py-1 ${style === 'cyberpunk' ? 'bg-[var(--accent-color)] text-black font-mono' : style === 'noir' ? 'bg-white text-black font-serif border border-black' : 'text-[var(--accent-color)] bg-black/40 backdrop-blur border border-white/10'}`}>
                   {level.title}
                </h1>
                <div className={`text-3xl md:text-6xl font-black text-white shadow-black drop-shadow-lg leading-tight ${style === 'noir' ? 'font-serif' : style === 'cyberpunk' ? 'font-mono tracking-tighter' : ''}`}>
                   {level.subtitle}
                </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl relative z-10 -mt-8">
        
        {/* Intro Text Card */}
        <div className={`
           mb-12 p-6 relative
           ${style === 'cyberpunk' ? 'bg-black border-2 border-[var(--accent-color)] shadow-[5px_5px_0px_var(--accent-color)]' : 
             style === 'noir' ? 'bg-white text-black border-2 border-black rotate-1 shadow-lg' :
             style === 'oil' ? 'bg-[#292524] border-t-4 border-amber-600 shadow-xl' :
             'bg-[var(--card-bg)] backdrop-blur-md border border-white/10 shadow-xl rounded-2xl'
           }
        `}>
           {style === 'noir' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-900/20 border border-red-900 flex items-center justify-center"><div className="w-2 h-2 bg-red-900 rounded-full"></div></div>}
           <p className={`text-lg leading-relaxed ${style === 'noir' ? 'font-serif font-bold text-slate-900 text-justify' : style === 'cyberpunk' ? 'font-mono text-[var(--accent-color)]' : 'font-serif text-[var(--text-primary)] italic'}`}>
             "{level.description}"
           </p>
        </div>

        {/* Module List */}
        <div className="space-y-2 pb-40">
          {level.modules.map((module, index) => {
             const isCompleted = completedModuleIds.includes(module.id);
             return renderModuleItem(module, index, isCompleted);
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedModule && (
        <QuizModal 
          key={selectedModule.id}
          isOpen={!!selectedModule} 
          isLoading={isLoadingQuiz}
          onClose={() => { audioService.playClick(); setSelectedModule(null); }}
          data={quizData}
          moduleName={selectedModule.name}
          onDecision={handleDecisionMade}
          onComplete={handleQuizClose}
          initialSelection={savedSelection}
          userProfile={userProfile}
        />
      )}

      <AIAssistant userProfile={userProfile} currentQuiz={quizData} />
    </div>
  );
};
