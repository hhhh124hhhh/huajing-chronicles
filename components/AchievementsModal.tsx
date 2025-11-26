import React, { useState } from 'react';
import { UserProgress, Achievement, FinancialReport, ModuleRecord } from '../types';
import { X, Award, Medal, Target, Zap, Crown, GraduationCap, BrainCircuit, Sparkles, RefreshCw, LayoutDashboard, Album, BookOpen, Calendar, CheckCircle2, AlertCircle, Fingerprint, BarChart3, ScanFace, Trash2, AlertTriangle, Save, Eye } from 'lucide-react';
import { generateUserReport } from '../services/gameService';
import { audioService } from '../services/audioService';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  onUpdateReport: (report: FinancialReport) => void;
  onResetProgress: () => void;
}

const ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_blood', 
    title: '入局', 
    description: '做出你的第一个命运抉择', 
    icon: 'Target', 
    condition: (p) => p.completedModules.length >= 1 || p.unlockedLevels > 1
  },
  { 
    id: 'survivor', 
    title: '幸存者', 
    description: '完成第一章：华京漂流记 (或同级章节)', 
    icon: 'Zap', 
    condition: (p) => p.unlockedLevels >= 2 // Level 2 means Chapter 1 is complete
  },
  { 
    id: 'awakening', 
    title: '觉醒时刻', 
    description: '抵达第四章：觉醒年代', 
    icon: 'Eye', 
    condition: (p) => p.unlockedLevels >= 4 // Reaching Chapter 4
  },
  { 
    id: 'capitalist', 
    title: '资本猎手', 
    description: '抵达第五章：资本博弈', 
    icon: 'Crown', 
    condition: (p) => p.unlockedLevels >= 5 // Reaching Chapter 5
  },
  { 
    id: 'legend', 
    title: '华京传说', 
    description: '通关所有章节，书写你的结局', 
    icon: 'GraduationCap', 
    condition: (p) => p.unlockedLevels > 6 // Level 6 completed
  }
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, progress, onUpdateReport, onResetProgress }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'album' | 'settings'>('dashboard');
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [reportError, setReportError] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen || !progress.profile) return null;

  const unlockedCount = ACHIEVEMENTS.filter(a => a.condition(progress)).length;
  
  const getIcon = (name: string) => {
    switch(name) {
      case 'Target': return <Target />;
      case 'Zap': return <Zap />;
      case 'Medal': return <Medal />;
      case 'Crown': return <Crown />;
      case 'GraduationCap': return <GraduationCap />;
      case 'Eye': return <Eye />;
      default: return <Award />;
    }
  };

  const getTitle = () => {
     if (progress.xp < 1000) return "流浪者";
     if (progress.xp < 3000) return "博弈者";
     if (progress.xp < 5000) return "操盘手";
     return "华京教父";
  };

  const handleGenerateReport = async () => {
    audioService.playClick();
    if (Object.keys(progress.history).length < 3) {
      alert("数据样本不足。请至少完成3个抉择后再进行人格侧写。");
      return;
    }
    
    setIsLoadingReport(true);
    setReportError(false);
    
    try {
      // Logic inside service now handles fallback, so it shouldn't throw unless critical
      const report = await generateUserReport(progress.history, progress.profile!.age);
      onUpdateReport(report);
      audioService.playLevelUp();
    } catch (e) {
      console.error(e);
      setReportError(true);
      audioService.playFailure();
    } finally {
      setIsLoadingReport(false);
    }
  };

  const handleTabChange = (tab: 'dashboard' | 'album' | 'settings') => {
    audioService.playClick();
    setActiveTab(tab);
  };

  const sortedHistory = (Object.values(progress.history) as ModuleRecord[]).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-sans text-slate-300">
      
      <div className="w-full max-w-4xl bg-[#0b0c10] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-800 flex flex-col max-h-[90vh] overflow-hidden relative">
        
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        {/* Header */}
        <div className="bg-slate-900/80 border-b border-slate-800 p-6 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
             <div className="relative">
                <div className="w-20 h-20 bg-slate-800 rounded-sm border border-slate-600 flex items-center justify-center text-4xl shadow-inner">
                   {progress.profile.ageGroup === 'adult' ? '🕵️' : progress.profile.ageGroup === 'teen' ? '🧑‍🎤' : '🧒'}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-950 border border-slate-700 p-1 rounded-sm">
                   <ScanFace size={16} className="text-purple-500" />
                </div>
             </div>
             
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <h2 className="text-2xl font-bold text-white tracking-wide font-serif">{progress.profile.nickname}</h2>
                   <span className="bg-purple-900/30 text-purple-400 border border-purple-500/30 text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-sm">
                     Level {progress.unlockedLevels}
                   </span>
                </div>
                <div className="text-xs text-slate-500 font-mono flex gap-3 uppercase tracking-wider">
                   <span>ID: {Math.floor(Math.random() * 100000).toString().padStart(6, '0')}</span>
                   <span>|</span>
                   <span>{progress.profile.industry || '自由职业'}</span>
                </div>
                <div className="mt-2 text-xs font-bold text-amber-500 flex items-center gap-1">
                   <Crown size={12} /> {getTitle()}
                </div>
             </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
             <button 
               onClick={() => handleTabChange('dashboard')}
               className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <LayoutDashboard size={14} /> 档案概览
             </button>
             <button 
               onClick={() => handleTabChange('album')}
               className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'album' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Album size={14} /> 决策回溯
             </button>
             <button 
               onClick={() => handleTabChange('settings')}
               className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <AlertTriangle size={14} /> 系统
             </button>
          </div>

          <button 
            onClick={() => { audioService.playClick(); onClose(); }} 
            className="absolute top-4 right-4 text-slate-600 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 custom-scrollbar">
          
          {activeTab === 'dashboard' ? (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                 <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm hover:border-purple-500/30 transition-colors">
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Zap size={12} /> 经验值
                    </div>
                    <div className="text-2xl font-mono text-slate-200">{progress.xp}</div>
                 </div>
                 <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm hover:border-emerald-500/30 transition-colors">
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                       <CheckCircle2 size={12} /> 完成度
                    </div>
                    <div className="text-2xl font-mono text-slate-200">{progress.completedModules.length}</div>
                 </div>
                 <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm hover:border-amber-500/30 transition-colors">
                    <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Medal size={12} /> 成就
                    </div>
                    <div className="text-2xl font-mono text-slate-200">{unlockedCount} <span className="text-sm text-slate-600">/ {ACHIEVEMENTS.length}</span></div>
                 </div>
              </div>

              {/* AI Persona */}
              <div className="border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-900/10 rounded-sm p-6 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BrainCircuit size={100} className="text-purple-500" />
                 </div>
                 
                 <div className="flex items-center justify-between mb-6 relative z-10">
                    <h3 className="text-slate-200 font-bold uppercase tracking-widest flex items-center gap-2">
                       <Fingerprint className="text-purple-500" size={18} />
                       人格侧写 (AI Analysis)
                    </h3>
                    {!progress.report && !isLoadingReport && (
                       <button 
                         onClick={handleGenerateReport}
                         className="text-xs bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-sm font-bold flex items-center gap-2 transition-all"
                       >
                         <Sparkles size={14} /> {reportError ? "启动备用分析" : "启动分析程序"}
                       </button>
                    )}
                 </div>

                 {isLoadingReport ? (
                    <div className="py-12 text-center border border-dashed border-slate-800 rounded-sm bg-black/20">
                       <RefreshCw className="animate-spin mx-auto text-purple-500 mb-3" size={24} />
                       <p className="text-xs text-purple-400 font-mono animate-pulse">正在连接华京市中央数据库...</p>
                    </div>
                 ) : reportError ? (
                    <div className="py-12 text-center border border-dashed border-red-900/50 rounded-sm bg-red-900/10">
                       <AlertTriangle className="mx-auto text-red-500 mb-3" size={24} />
                       <p className="text-xs text-red-400 font-mono mb-4">网络连接异常。已启动应急预案。</p>
                       <button 
                         onClick={handleGenerateReport}
                         className="text-xs bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-sm font-bold"
                       >
                         重试 / 使用本地模式
                       </button>
                    </div>
                 ) : progress.report ? (
                    <div className="space-y-5 relative z-10 animate-in fade-in duration-700">
                       <div className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-black/20 p-4 border-l-2 border-purple-500">
                          <div className="flex-1">
                            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">人格标签</div>
                            <div className="text-2xl font-bold text-white font-serif tracking-wide">{progress.report.personaTitle}</div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">财商评分</div>
                                <div className="text-3xl font-mono font-bold text-purple-400">{progress.report.score}</div>
                             </div>
                             <BarChart3 className="text-slate-700" size={32} />
                          </div>
                       </div>
                       
                       <div className="grid md:grid-cols-2 gap-6">
                          <div>
                             <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">行为分析</h4>
                             <p className="text-sm text-slate-400 leading-relaxed font-serif">
                                {progress.report.analysis}
                             </p>
                          </div>
                          <div>
                             <h4 className="text-[10px] font-bold text-amber-500/80 uppercase mb-2">生存建议</h4>
                             <p className="text-sm text-slate-300 leading-relaxed bg-amber-900/10 border border-amber-900/20 p-3 rounded-sm">
                                {progress.report.advice}
                             </p>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="text-center py-10 text-slate-600 text-sm border border-dashed border-slate-800 bg-black/20 rounded-sm">
                       <p className="mb-2">暂无数据档案</p>
                       <p className="text-xs opacity-50">系统需要更多样本（至少完成3个模块）才能生成画像。</p>
                    </div>
                 )}
              </div>

              {/* Achievement List */}
              <div>
                <h3 className="text-slate-200 font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Medal className="text-slate-500" size={18} />
                  荣誉记录
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ACHIEVEMENTS.map((achievement) => {
                    const isUnlocked = achievement.condition(progress);
                    return (
                      <div 
                        key={achievement.id}
                        className={`
                          p-4 rounded-sm border flex items-center gap-4 transition-all duration-300 group
                          ${isUnlocked 
                            ? 'bg-slate-900/80 border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.3)]' 
                            : 'bg-slate-950 border-slate-900 opacity-40 grayscale'
                          }
                        `}
                      >
                        <div className={`
                          w-10 h-10 rounded-sm flex items-center justify-center shrink-0 border
                          ${isUnlocked ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-700'}
                        `}>
                          {getIcon(achievement.icon)}
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${isUnlocked ? 'text-slate-200' : 'text-slate-600'}`}>
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 font-mono">
                            {achievement.description}
                          </p>
                        </div>
                        {isUnlocked && (
                           <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                             <CheckCircle2 size={16} className="text-emerald-500" />
                           </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : activeTab === 'album' ? (
            /* ALBUM TAB */
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                     <BookOpen className="text-slate-500" size={18} />
                     命运分支记录
                  </h3>
               </div>

               {sortedHistory.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-32 text-slate-700">
                    <Fingerprint size={48} className="mb-4 opacity-20" />
                    <p className="font-mono text-sm">暂无行动记录</p>
                 </div>
               ) : (
                 <div className="relative border-l border-slate-800 ml-3 space-y-10 py-4">
                    {sortedHistory.map((record, idx) => {
                       const isBestChoice = record.selectedOptionIndex === record.quizData.correctIndex;
                       const dateStr = record.timestamp ? new Date(record.timestamp).toLocaleString('zh-CN', { hour12: false }) : 'Unknown';
                       
                       return (
                         <div key={idx} className="relative pl-8 group">
                            {/* Node */}
                            <div className={`
                               absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full border border-slate-950 transition-colors
                               ${isBestChoice ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)]'}
                            `}></div>

                            {/* Card */}
                            <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-sm hover:bg-slate-900/60 hover:border-slate-700 transition-all">
                               <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase">
                                     <Calendar size={10} /> {dateStr}
                                  </div>
                                  {isBestChoice ? (
                                     <span className="text-[10px] font-bold text-emerald-500 border border-emerald-900/50 bg-emerald-900/10 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        Perfect Clear
                                     </span>
                                  ) : (
                                     <span className="text-[10px] font-bold text-amber-500 border border-amber-900/50 bg-amber-900/10 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                        Lesson Learned
                                     </span>
                                  )}
                               </div>

                               <h4 className="text-base font-bold text-slate-200 mb-3 font-serif">
                                 {record.quizData.question}
                               </h4>
                               
                               <div className="grid grid-cols-1 gap-2 mb-4">
                                  <div className="bg-black/30 border border-slate-800 p-3 rounded-sm">
                                     <span className="text-[10px] text-slate-500 block mb-1 uppercase tracking-wider">你的选择</span>
                                     <span className={`text-sm ${isBestChoice ? 'text-emerald-400' : 'text-amber-500'}`}>
                                        {record.quizData.options[record.selectedOptionIndex]}
                                     </span>
                                  </div>
                               </div>

                               <p className="text-sm text-slate-400 italic font-serif pl-3 border-l-2 border-slate-700">
                                 "{record.quizData.outcomes[record.selectedOptionIndex]}"
                               </p>
                            </div>
                         </div>
                       );
                    })}
                 </div>
               )}
            </div>
          ) : (
            /* SETTINGS TAB */
             <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                     <AlertTriangle className="text-red-500" size={18} />
                     系统管理
                  </h3>
               </div>
               
               <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-sm mb-4">
                   <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                     <Save size={16} /> 进度存档
                   </h4>
                   <p className="text-slate-400 text-sm mb-4">
                     系统会自动保存你的每次决策。你也可以点击下方按钮强制刷新存档状态。
                   </p>
                   <button 
                     className="bg-slate-800 text-slate-300 border border-slate-600 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider cursor-default opacity-75"
                   >
                     自动存档已开启 (Auto-Save Active)
                   </button>
               </div>

               <div className="bg-red-900/10 border border-red-900/30 p-6 rounded-sm">
                  <h4 className="text-red-400 font-bold mb-2 flex items-center gap-2">
                    <Trash2 size={16} /> 重置所有数据
                  </h4>
                  <p className="text-slate-400 text-sm mb-6">
                    这将清除你的角色、所有关卡进度、历史记录和成就。此操作不可撤销。
                  </p>
                  
                  {showResetConfirm ? (
                    <div className="flex gap-4 items-center animate-in fade-in">
                       <button 
                         onClick={() => { audioService.playClick(); onResetProgress(); }}
                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors"
                       >
                         确认清除
                       </button>
                       <button 
                         onClick={() => { audioService.playClick(); setShowResetConfirm(false); }}
                         className="text-slate-400 hover:text-white px-4 py-2 text-sm"
                       >
                         取消
                       </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => { audioService.playClick(); setShowResetConfirm(true); }}
                      className="border border-red-900 text-red-500 hover:bg-red-900 hover:text-white px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wider transition-colors"
                    >
                      删除存档
                    </button>
                  )}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};