
import React, { useState, useEffect, useRef } from 'react';
import { QuizData, UserProfile } from '../types';
import { X, Activity, Search, AlertCircle, FileCheck, BrainCircuit, Disc, Aperture, Paintbrush, Fingerprint, Stamp } from 'lucide-react';
import { audioService } from '../services/audioService';

interface QuizModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  data: QuizData | null;
  moduleName: string;
  onComplete: () => void;
  onDecision: (index: number) => void;
  initialSelection?: number | null;
  userProfile: UserProfile;
}

export const QuizModal: React.FC<QuizModalProps> = ({ 
  isOpen, 
  isLoading, 
  onClose, 
  data, 
  moduleName,
  onComplete,
  onDecision,
  initialSelection = null,
  userProfile
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(initialSelection);
  const [isSubmitted, setIsSubmitted] = useState(initialSelection !== null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !initialSelection) {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [isOpen, data, initialSelection]);

  useEffect(() => {
    if (isSubmitted && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 500);
    }
  }, [isSubmitted]);

  if (!isOpen) return null;

  const handleOptionClick = (index: number) => {
    if (isSubmitted) return;
    audioService.playClick();
    setSelectedOption(index);
    setIsSubmitted(true);
    onDecision(index);
    
    if (data && index === data.correctIndex) {
        audioService.playSuccess();
    } else {
        audioService.playClick(); 
    }
  };

  const isOptimal = isSubmitted && selectedOption === data?.correctIndex;
  
  const storyOutcome = (isSubmitted && data && selectedOption !== null && data.outcomes && data.outcomes[selectedOption]) 
    ? data.outcomes[selectedOption]
    : data?.explanation;

  const style = userProfile.avatarStyle || 'cyberpunk';

  // --- STYLE FACTORIES ---
  
  const getCardStyle = (isSelected: boolean, isDisabled: boolean) => {
    // Common Base
    let base = "relative group text-left h-full min-h-[220px] flex flex-col transition-all duration-500 ease-out preserve-3d overflow-hidden ";
    if (isDisabled && !isSelected) base += "opacity-40 grayscale blur-[1px] ";
    else base += "opacity-100 ";
    
    if (isSelected) base += "scale-105 z-10 ";
    else base += "hover:-translate-y-2 ";

    return base;
  };

  const renderCardContent = (option: string, index: number, isSelected: boolean) => {
     const labels = ["A", "B", "C"];
     const label = labels[index % 3];

     // --- CYBERPUNK: Holographic Data Shards ---
     if (style === 'cyberpunk') {
        return (
           <div className={`
              flex-1 flex flex-col p-6 border relative bg-black/90 backdrop-blur-md 
              ${isSelected 
                 ? 'border-[var(--accent-color)] shadow-[0_0_30px_rgba(0,255,157,0.4)]' 
                 : 'border-slate-800 hover:border-[var(--accent-color)]/50'
              }
           `}>
              <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(var(--accent-color),.1)_25%,rgba(var(--accent-color),.1)_26%,transparent_27%,transparent_74%,rgba(var(--accent-color),.1)_75%,rgba(var(--accent-color),.1)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(var(--accent-color),.1)_25%,rgba(var(--accent-color),.1)_26%,transparent_27%,transparent_74%,rgba(var(--accent-color),.1)_75%,rgba(var(--accent-color),.1)_76%,transparent_77%,transparent)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6 border-b border-white/20 pb-2">
                 <span className="text-xs font-mono font-bold text-[var(--accent-color)] glitch-hover tracking-widest">{'>>'} OPTION_0{index+1}</span>
                 <Disc size={16} className={`text-slate-500 ${isSelected ? 'animate-spin text-[var(--accent-color)]' : ''}`} />
              </div>
              
              <p className={`font-mono text-sm leading-relaxed z-10 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{option}</p>
              
              {isSelected && <div className="absolute bottom-2 right-2 text-[10px] font-mono text-[var(--accent-color)] animate-pulse bg-black/50 px-2">{'>>'} EXECUTING...</div>}
              
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[var(--accent-color)]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[var(--accent-color)]"></div>
           </div>
        );
     }
     
     // --- NOIR: Evidence Photos / Case Files ---
     if (style === 'noir') {
        return (
           <div className={`
              flex-1 flex flex-col p-6 relative bg-[#f5f5f5] text-slate-900 shadow-xl transition-transform
              ${isSelected ? 'rotate-0 scale-105 z-20 border-4 border-red-900' : 'rotate-1 hover:rotate-0 border border-slate-400'}
           `}>
              {/* Paper Texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-80 mix-blend-multiply pointer-events-none"></div>
              
              {/* Coffee Stain / Dirt */}
              {index === 1 && <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full border-4 border-[#8b5a2b]/20 blur-sm pointer-events-none"></div>}
              
              <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-slate-800 z-10">
                 <span className="text-lg font-bold font-serif uppercase tracking-widest text-black">EXHIBIT {label}</span>
                 <Fingerprint size={32} className="text-slate-400 opacity-30" />
              </div>
              
              <p className="font-serif text-base font-medium leading-loose z-10 text-slate-800 flex-1">{option}</p>
              
              {isSelected && (
                 <div className="absolute bottom-6 right-6 border-4 border-red-700 text-red-700 px-4 py-1 font-black text-xl uppercase -rotate-12 z-20 opacity-80 mix-blend-multiply">
                    SELECTED
                 </div>
              )}
           </div>
        );
     }

     // --- OIL: Tarot Cards / Canvas ---
     if (style === 'oil') {
        return (
           <div className={`
              flex-1 flex flex-col p-6 relative bg-[#292524] text-[#fed7aa] shadow-2xl
              ${isSelected ? 'border-[4px] border-amber-500 -translate-y-4' : 'border-[4px] border-[#57534e] hover:border-[#78350f]'}
           `}>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-30 mix-blend-overlay pointer-events-none"></div>
              
              <div className="flex justify-center mb-6 z-10">
                 <span className="text-sm font-serif italic text-amber-500/80 decoration-amber-500/50 underline underline-offset-8">The Path of {['Fortune', 'Justice', 'Temperance'][index]}</span>
              </div>
              
              <p className="font-serif text-base leading-relaxed z-10 text-center text-amber-100/90">{option}</p>
              
              <div className="mt-auto pt-6 flex justify-center opacity-30 text-amber-700">
                 <Paintbrush size={24} />
              </div>
           </div>
        );
     }

     // --- ANIME / DEFAULT: Glass Cards ---
     return (
        <div className={`
           flex-1 flex flex-col p-8 rounded-3xl relative bg-white/10 backdrop-blur-xl border transition-all
           ${isSelected ? 'ring-2 ring-sky-300 bg-white/20 shadow-[0_0_40px_rgba(56,189,248,0.3)]' : 'border-white/20 hover:bg-white/15'}
        `}>
           <div className="flex items-center gap-3 mb-4 z-10">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-sky-400 text-white shadow-lg' : 'bg-white/10 text-white'}`}>
                 {label}
              </div>
              <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">Potential Future</span>
           </div>
           
           <p className="text-base font-medium leading-relaxed z-10 text-white drop-shadow-md">{option}</p>
           
           {isSelected && <div className="absolute top-6 right-6 text-sky-300 animate-bounce"><Aperture size={20}/></div>}
        </div>
     );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className={`w-full max-w-6xl h-full md:h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col relative ${style === 'cyberpunk' ? 'border border-[var(--accent-color)] bg-black' : 'border border-white/10 bg-[var(--bg-primary)]'}`}>
        
        {/* Header */}
        <div className={`relative h-16 shrink-0 flex items-center justify-between px-6 z-20 ${style === 'noir' ? 'bg-white text-black border-b-2 border-black' : 'bg-[var(--bg-primary)] border-b border-white/10'}`}>
           <div className="flex flex-col">
              <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${style === 'noir' ? 'text-slate-600' : 'text-[var(--accent-color)]'}`}>
                <Activity size={12} /> {style === 'noir' ? 'INTERROGATION ROOM' : 'DECISION PROTOCOL'}
              </div>
              <h2 className="text-lg font-bold tracking-wide font-serif">{moduleName}</h2>
           </div>

           {!isLoading && (
            <button onClick={onClose} className="text-slate-500 hover:text-red-500 transition-colors">
              <X size={24} />
            </button>
           )}
        </div>

        {/* Main Split Layout */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Panel: Scenario */}
            <div className={`w-full md:w-5/12 p-8 overflow-y-auto relative ${style === 'noir' ? 'bg-[#e5e5e5] text-black border-r-2 border-black' : 'bg-[var(--bg-primary)] border-r border-white/10'}`}>
               {/* Background Texture for Left Panel */}
               {style === 'noir' && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>}
               {style === 'cyberpunk' && <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>}

               {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-50">
                     <div className={`w-10 h-10 border-2 rounded-full animate-spin ${style === 'noir' ? 'border-black border-t-transparent' : 'border-[var(--text-primary)] border-t-[var(--accent-color)]'}`}></div>
                     <span className="text-xs font-mono tracking-widest">DECRYPTING SCENARIO...</span>
                  </div>
               ) : data ? (
                 <div className="space-y-8 animate-in slide-in-from-left duration-500 relative z-10">
                    <div>
                       <div className={`flex items-center gap-2 mb-3 ${style === 'noir' ? 'text-slate-600' : 'text-slate-400'}`}>
                           <Search size={16} />
                           <span className="text-xs font-bold uppercase tracking-widest">Current Situation</span>
                       </div>
                       <p className={`text-xl md:text-2xl font-medium leading-relaxed font-serif ${style === 'noir' ? 'italic text-slate-900' : 'text-[var(--text-primary)]'}`}>
                          {data.scenario}
                       </p>
                    </div>
                    
                    <div className={`p-6 ${style === 'noir' ? 'bg-black text-white rotate-1' : 'border-l-2 border-[var(--accent-color)] bg-[var(--accent-color)]/5'}`}>
                        <div className={`flex items-center gap-2 mb-2 ${style === 'noir' ? 'text-red-500' : 'text-[var(--accent-color)]'}`}>
                            <AlertCircle size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">CRITICAL CHOICE</span>
                        </div>
                        <h3 className="text-lg font-bold leading-relaxed">
                           {data.question}
                        </h3>
                    </div>
                 </div>
               ) : null}
            </div>

            {/* Right Panel: Options */}
            <div ref={scrollRef} className={`w-full md:w-7/12 relative overflow-y-auto p-6 md:p-10 ${style === 'noir' ? 'bg-[#333]' : 'bg-black/40'}`}>
               
               {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                     <div className="text-slate-500 font-mono text-xs animate-pulse">Awaiting Neural Link...</div>
                  </div>
               ) : data ? (
                  <div className="max-w-3xl mx-auto space-y-10 relative z-10 pb-20">
                     
                     <div className="grid grid-cols-1 gap-6">
                        {data.options.map((option, idx) => {
                           const isSelected = selectedOption === idx;
                           const isDisabled = isSubmitted;

                           return (
                              <button
                                 key={idx}
                                 onClick={() => handleOptionClick(idx)}
                                 disabled={isDisabled}
                                 className={getCardStyle(isSelected, isDisabled)}
                              >
                                 {renderCardContent(option, idx, isSelected)}
                              </button>
                           );
                        })}
                     </div>

                     {/* Outcome Section */}
                     {isSubmitted && storyOutcome && (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 pt-8 border-t border-white/10">
                           <div className={`
                              p-8 relative overflow-hidden transition-all
                              ${style === 'noir' 
                                 ? 'bg-white text-black border-4 border-double border-black' 
                                 : style === 'cyberpunk'
                                 ? 'bg-black border border-[var(--accent-color)] shadow-[0_0_20px_var(--accent-color)]'
                                 : 'bg-[var(--card-bg)] border border-[var(--accent-color)]'
                              }
                           `}>
                              {/* Status Indicator */}
                              <div className={`absolute top-0 left-0 w-2 h-full ${isOptimal ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              
                              <div className="flex items-center gap-3 mb-4 pl-4">
                                 <div className={`p-2 rounded-full ${isOptimal ? 'bg-emerald-900/20 text-emerald-600' : 'bg-amber-900/20 text-amber-600'}`}>
                                    {isOptimal ? <BrainCircuit size={24} /> : <FileCheck size={24} />}
                                 </div>
                                 <h3 className={`text-sm font-bold uppercase tracking-[0.2em] ${isOptimal ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {isOptimal ? "OPTIMAL STRATEGY" : "LEARNING OPPORTUNITY"}
                                 </h3>
                              </div>

                              <p className={`text-xl leading-relaxed mb-8 font-serif pl-4 ${style === 'noir' ? 'text-black' : 'text-[var(--text-primary)]'}`}>
                                 "{storyOutcome}"
                              </p>

                              {data.explanation && (
                                 <div className={`p-4 text-xs font-mono mb-8 pl-4 mx-4 ${style === 'noir' ? 'bg-slate-200 text-slate-600' : 'bg-black/30 text-slate-400 border-l border-slate-600'}`}>
                                    <span className="font-bold mr-2 uppercase">[Analysis]</span>
                                    {data.explanation}
                                 </div>
                              )}

                              <div className="flex justify-end pr-4">
                                 <button 
                                    onClick={() => {
                                       audioService.playClick();
                                       onComplete();
                                    }} 
                                    className={`
                                       px-10 py-4 text-sm font-black uppercase tracking-widest transition-all
                                       ${style === 'noir' 
                                          ? 'bg-black text-white hover:bg-red-700' 
                                          : style === 'cyberpunk'
                                          ? 'bg-[var(--accent-color)] text-black hover:bg-white hover:shadow-[0_0_20px_white]'
                                          : 'bg-white text-black hover:scale-105'
                                       }
                                    `}
                                 >
                                    CONTINUE PROTOCOL
                                 </button>
                              </div>
                           </div>
                        </div>
                     )}

                  </div>
               ) : null}
            </div>
        </div>
      </div>
    </div>
  );
};
