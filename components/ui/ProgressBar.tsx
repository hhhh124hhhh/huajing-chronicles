import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  colorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, colorClass = "bg-blue-500" }) => {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-600 overflow-hidden">
      <div 
        className={`${colorClass} h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2 text-[10px] font-bold text-white shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
        style={{ width: `${Math.max(5, progress)}%` }}
      >
        {progress.toFixed(0)}%
      </div>
    </div>
  );
};