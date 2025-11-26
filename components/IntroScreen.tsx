
import React, { useEffect, useState } from 'react';
import { UserProfile, IntroData } from '../types';
import { generateIntroStory } from '../services/gameService';
import { ArrowRight, Sparkles, Loader2, Image as ImageIcon, Film } from 'lucide-react';
import { audioService } from '../services/audioService';

interface IntroScreenProps {
  profile: UserProfile;
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ profile, onComplete }) => {
  const [data, setData] = useState<IntroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    audioService.playPop(); // Intro sound
    const loadStory = async () => {
      try {
        const result = await generateIntroStory(profile.nickname, profile.ageGroup, profile.industry || '', profile.avatarStyle);
        setData(result);
        if (!result.story) setError(true);
        audioService.playSuccess(); // Loaded sound
      } catch (e) {
        console.error(e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadStory();
  }, [profile]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden text-white font-sans">
      
      {/* Background Ambient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-5xl px-6 flex flex-col items-center">
        
        {loading ? (
           <div className="text-center space-y-8 animate-pulse flex flex-col items-center">
             <div className="w-24 h-24 bg-slate-900 rounded-full border border-purple-500/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"></div>
                <Film className="text-purple-500 w-10 h-10 opacity-50" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white tracking-widest uppercase font-serif">SCENE GENERATION</h2>
               <div className="flex items-center gap-2 justify-center mt-3 text-xs text-purple-400 font-mono uppercase">
                  <Loader2 size={12} className="animate-spin" />
                  <span>Constructing {profile.industry || 'World'} Narrative...</span>
               </div>
             </div>
           </div>
        ) : (
          <div className="space-y-8 animate-in fade-in zoom-in duration-1000 w-full flex flex-col items-center">
             
             {/* Content Layout */}
             <div className="flex flex-col md:flex-row gap-8 items-center w-full">
               
               {/* Left: Image Card */}
               <div className="w-full md:w-1/2 relative aspect-video rounded-sm overflow-hidden shadow-[0_0_50px_rgba(100,0,255,0.1)] border border-slate-800 bg-slate-900 group">
                 {data?.imageUrl ? (
                    <img 
                      src={data.imageUrl} 
                      alt="Intro Scene" 
                      className="w-full h-full object-cover transition-transform duration-[30s] ease-linear scale-100 group-hover:scale-110 opacity-90"
                    />
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950">
                      <ImageIcon size={48} className="mb-2 opacity-30" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">No Visual Signal</span>
                   </div>
                 )}
                 {/* Vignette */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                 
                 {/* Watermark */}
                 <div className="absolute top-4 left-4 border border-white/20 px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-white/50 backdrop-blur-sm">
                    Huajing City Archive
                 </div>
               </div>

               {/* Right: Text Content */}
               <div className="w-full md:w-1/2 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">
                      <Sparkles size={12} /> Prologue
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold font-serif text-white leading-tight">
                    Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">{profile.nickname}</span>
                  </h1>

                  <div className="relative pl-6 border-l-2 border-purple-900">
                    <p className="text-base md:text-lg leading-relaxed text-slate-300 font-serif italic opacity-90">
                        "{data?.story || '连接建立失败...'}"
                    </p>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => { audioService.playClick(); onComplete(); }}
                      onMouseEnter={() => audioService.playHover()}
                      className="group relative px-8 py-4 bg-white hover:bg-purple-50 text-black rounded-sm font-black text-xs tracking-[0.2em] uppercase transition-all flex items-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                    >
                      <span>Begin Simulation</span>
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                    </button>
                  </div>
               </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
};
