import React, { useState, useEffect } from 'react';
import { MapScreen } from './components/MapScreen';
import { LevelScreen } from './components/LevelScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { IntroScreen } from './components/IntroScreen';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { getLevels } from './constants';
import { Level, UserProgress, QuizData, UserProfile, FinancialReport, ModuleRecord } from './types';
import { audioService } from './services/audioService';
import { updateNarrativeContext } from './services/gameService';

const App: React.FC = () => {
  // Game State
  const [currentView, setCurrentView] = useState<'welcome' | 'intro' | 'map' | 'level'>('welcome');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  
  // Level Complete Modal State
  const [levelCompleteData, setLevelCompleteData] = useState<{
    isOpen: boolean;
    levelNumber: number;
    levelTitle: string;
    xpGained: number;
    nextLevelId: number;
  }>({
    isOpen: false,
    levelNumber: 0,
    levelTitle: '',
    xpGained: 0,
    nextLevelId: 0
  });

  const INITIAL_STATE: UserProgress = {
    unlockedLevels: 1,
    completedModules: [],
    xp: 0,
    history: {},
    profile: undefined,
    narrativeContext: "Game Start."
  };

  // Persistence State
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('financialGameProgress_v6'); 
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('financialGameProgress_v6', JSON.stringify(progress));
  }, [progress]);

  // Init Audio
  useEffect(() => {
    audioService.init();
  }, []);

  // Initial check for profile
  useEffect(() => {
    if (progress.profile) {
      setCurrentView('map');
    } else {
      setCurrentView('welcome');
    }
  }, []);

  const handleProfileComplete = (profile: UserProfile) => {
    audioService.playSuccess();
    setProgress(prev => ({ ...prev, profile }));
    setCurrentView('intro');
  };

  const handleIntroComplete = () => {
    audioService.playClick();
    setCurrentView('map');
  };

  const handleUpdateReport = (report: FinancialReport) => {
    setProgress(prev => ({ ...prev, report }));
  };

  const handleResetProgress = () => {
    localStorage.removeItem('financialGameProgress_v6');
    setProgress(INITIAL_STATE);
    setCurrentView('welcome');
    setSelectedLevel(null);
  };

  // CHEAT CODE: Unlock All Levels & Populate History
  const handleCheatUnlock = () => {
    audioService.playLevelUp();
    
    const ageGroup = progress.profile?.ageGroup || 'adult';
    const levels = getLevels(ageGroup);
    const completedModules: string[] = [];
    const dummyHistory: Record<string, ModuleRecord> = {};

    // Auto-complete all modules with dummy data for testing
    levels.forEach(level => {
      level.modules.forEach((module, idx) => {
        completedModules.push(module.id);
        dummyHistory[module.id] = {
          moduleId: module.id,
          quizData: {
            scenario: "【上帝模式系统存档】",
            question: `${module.name} - 模拟回顾`,
            options: ["选项 A", "选项 B (已选)", "选项 C"],
            outcomes: ["结果 A", "结果 B", "结果 C"],
            correctIndex: 1,
            explanation: "此记录由开发者指令生成，用于测试系统功能与回顾界面。"
          },
          selectedOptionIndex: 1,
          timestamp: Date.now() - (100000 * (levels.length - level.id + 1)), // Stagger timestamps
          isOptimal: true
        };
      });
    });

    setProgress(prev => ({
      ...prev,
      unlockedLevels: 7, // Unlock all 6 levels + endgame state
      xp: 9999, // Max XP
      completedModules: completedModules,
      history: { ...prev.history, ...dummyHistory },
      narrativeContext: prev.narrativeContext + " [SYSTEM OVERRIDE: GOD MODE ACTIVATED]"
    }));
  };

  // Navigation
  const handleLevelSelect = (level: Level) => {
    audioService.playClick();
    setSelectedLevel(level);
    setCurrentView('level');
    window.scrollTo(0,0);
  };

  const handleBackToMap = () => {
    audioService.playClick();
    setSelectedLevel(null);
    setCurrentView('map');
  };

  const handleNextLevel = () => {
    audioService.playClick();
    setLevelCompleteData(prev => ({ ...prev, isOpen: false }));
    
    if (!progress.profile) return;

    const levels = getLevels(progress.profile.ageGroup);
    const nextLevel = levels.find(l => l.id === levelCompleteData.nextLevelId);

    if (nextLevel) {
       setSelectedLevel(nextLevel);
       setCurrentView('level');
       window.scrollTo(0,0);
    } else {
       handleBackToMap();
    }
  };

  // Logic: Record Decision AND Update Narrative
  const handleModuleAttempt = async (moduleId: string, quizData: QuizData, selectedIndex: number) => {
    const isOptimal = selectedIndex === quizData.correctIndex;
    
    const newHistory = {
      ...progress.history,
      [moduleId]: {
        moduleId,
        quizData,
        selectedOptionIndex: selectedIndex,
        timestamp: Date.now(),
        isOptimal
      }
    };

    const xpGain = isOptimal ? 150 : 50;
    
    setProgress(prev => ({
      ...prev,
      history: newHistory,
      xp: prev.xp + xpGain
    }));

    handleModuleCompletion(moduleId, xpGain);

    try {
      const newContext = await updateNarrativeContext(
        progress.narrativeContext,
        quizData.scenario,
        quizData.options[selectedIndex],
        quizData.outcomes[selectedIndex] || "outcome unclear",
        isOptimal
      );
      
      setProgress(prev => ({
        ...prev,
        narrativeContext: newContext
      }));
    } catch (e) {
      console.error("Narrative update failed", e);
    }
  };

  const handleModuleCompletion = (moduleId: string, earnedXp: number) => {
    const isNewCompletion = !progress.completedModules.includes(moduleId);
    
    if (isNewCompletion) {
      const newCompletedModules = [...progress.completedModules, moduleId];
      let newUnlockedLevel = progress.unlockedLevels;
      let totalXP = progress.xp + earnedXp;

      if (selectedLevel && progress.profile) {
        const levelModuleIds = selectedLevel.modules.map(m => m.id);
        const allModulesCompleted = levelModuleIds.every(id => newCompletedModules.includes(id));
        
        if (allModulesCompleted && selectedLevel.id === progress.unlockedLevels) {
          const levels = getLevels(progress.profile.ageGroup);
          const nextLvl = Math.min(progress.unlockedLevels + 1, levels.length + 1);
          newUnlockedLevel = nextLvl;
          const levelBonusXP = 500;
          totalXP += levelBonusXP; 

          audioService.playLevelUp();

          setLevelCompleteData({
            isOpen: true,
            levelNumber: selectedLevel.id,
            levelTitle: selectedLevel.subtitle,
            xpGained: levelBonusXP,
            nextLevelId: selectedLevel.id + 1
          });
        }
      }

      setProgress(prev => ({
        ...prev,
        completedModules: newCompletedModules,
        unlockedLevels: newUnlockedLevel,
        xp: totalXP
      }));
    }
  };

  if (currentView === 'welcome' || !progress.profile) {
    return <WelcomeScreen onComplete={handleProfileComplete} />;
  }

  // Calculate the theme class based on profile
  const themeClass = progress.profile?.avatarStyle ? `theme-${progress.profile.avatarStyle}` : '';

  return (
    <div className={`app-root ${themeClass} min-h-screen relative`}>
      <div className="bg-noise"></div>
      <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-primary)] to-[#000000] pointer-events-none transition-colors duration-500"></div>
      
      <div className="antialiased text-[var(--text-primary)] font-sans selection:bg-[var(--accent-color)] selection:text-white">
        {currentView === 'intro' && (
           <IntroScreen profile={progress.profile} onComplete={handleIntroComplete} />
        )}
        
        {currentView === 'map' && (
          <MapScreen 
            levels={getLevels(progress.profile.ageGroup)}
            unlockedLevelMax={progress.unlockedLevels} 
            onLevelSelect={handleLevelSelect}
            completedModuleCount={progress.completedModules.length}
            userProfile={progress.profile}
            userProgress={progress}
            onUpdateReport={handleUpdateReport}
            onResetProgress={handleResetProgress}
            onCheatUnlock={handleCheatUnlock}
          />
        )}
        
        {currentView === 'level' && selectedLevel && (
            <LevelScreen 
              level={selectedLevel} 
              onBack={handleBackToMap} 
              completedModuleIds={progress.completedModules}
              moduleHistory={progress.history || {}}
              onModuleComplete={handleModuleAttempt} 
              userProfile={progress.profile} 
              narrativeContext={progress.narrativeContext}
            />
        )}

        <LevelCompleteModal 
          isOpen={levelCompleteData.isOpen}
          levelNumber={levelCompleteData.levelNumber}
          levelTitle={levelCompleteData.levelTitle}
          xpGained={levelCompleteData.xpGained}
          onNextLevel={handleNextLevel}
          onClose={() => {
            audioService.playClick();
            setLevelCompleteData(prev => ({ ...prev, isOpen: false }));
          }}
          isMaxLevel={levelCompleteData.nextLevelId > getLevels(progress.profile.ageGroup).length}
        />
      </div>
    </div>
  );
};

export default App;