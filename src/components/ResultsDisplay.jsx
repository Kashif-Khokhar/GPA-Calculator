import React from 'react';
import { Zap } from 'lucide-react';

export const ResultsDisplay = ({ results, activeTab, isDarkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <div className={`${activeTab === 'detailed' ? 'md:col-span-3' : 'md:col-span-2'} glass rounded-2xl sm:rounded-[2.5rem] p-5 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-around gap-6 sm:gap-8 relative overflow-hidden`}>
        
        <div className="text-center md:text-left transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-400 mb-1">Total Credits</p>
          <div 
            className="text-4xl sm:text-5xl font-black leading-none tracking-tight" 
            style={{ color: isDarkMode ? '#ffffff' : '#0284c7' }}
          >
            {results.credits || '0'}
          </div>
        </div>
        <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
        <div className="text-center md:text-left transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-400 mb-1">
            {results.semesterGPAs.length <= 1 ? "Semester GPA" : "Cumulative CGPA"}
          </p>
          <div className="text-5xl sm:text-6xl font-black text-brand-600 dark:text-brand-400 drop-shadow-sm leading-none tracking-tight">
            {results.cgpa}
          </div>
          
          {results.semesterGPAs.length > 1 && (
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2 max-w-md">
              {results.semesterGPAs.map((s, idx) => (
                <div key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-[9px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                  SEM {idx + 1}: <span className="text-brand-600 dark:text-brand-400">{s.gpa}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {activeTab === 'detailed' ? null : (
        <div className="glass rounded-[2.5rem] p-8 flex flex-col justify-center space-y-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h3 className="font-bold">CGPA Calculator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter semester GPAs directly for a fast cumulative result.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
