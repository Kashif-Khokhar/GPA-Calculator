import React from 'react';
import { GraduationCap, Info, Moon, Sun, Upload, Printer, RefreshCcw, ListTodo, Zap } from 'lucide-react';
import { cn } from '../utils/helpers.js';

export const Header = ({ 
  activeTab, 
  setActiveTab, 
  isDarkMode, 
  setIsDarkMode, 
  onShowGradingScale,
  onImportClick,
  onExport,
  onReset
}) => {
  return (
    <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 print:hidden">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/30 shrink-0">
          <GraduationCap className="text-white w-8 h-8 sm:w-9 sm:h-9" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Superior GPA <span className="text-brand-600 dark:text-brand-400">Calculator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md">
            Academic performance tracking & detailed analysis platform.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* Navigation Tabs */}
        <div className="glass p-1 rounded-2xl flex gap-1 bg-white/40 dark:bg-slate-800/40">
          <button 
            onClick={() => setActiveTab('detailed')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'detailed' ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-105" : "text-slate-500 hover:bg-white/60 dark:hover:bg-slate-700/60"
            )}
          >
            <ListTodo className="w-4 h-4" />
            GPA Calculator
          </button>
          <button 
            onClick={() => setActiveTab('quick')}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              activeTab === 'quick' ? "bg-brand-600 text-white shadow-lg shadow-brand-600/30 scale-105" : "text-slate-500 hover:bg-white/60 dark:hover:bg-slate-700/60"
            )}
          >
            <Zap className="w-4 h-4" />
            CGPA Calculator
          </button>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onShowGradingScale}
            className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-900/30 rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
            title="View Grading Scale"
          >
            <Info className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:scale-110 active:scale-95"
          >
            {isDarkMode ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6" />}
          </button>

          <button 
            onClick={onImportClick}
            className="btn-secondary h-[50px] flex items-center gap-2 px-4 rounded-2xl"
            title="Import PDF Results"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button 
            onClick={onExport}
            className="btn-secondary h-[50px] flex items-center gap-2 px-4 rounded-2xl"
          >
            <Printer className="w-5 h-5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button 
            onClick={onReset}
            className="p-3 bg-rose-50 dark:bg-rose-900/10 text-rose-600 border border-rose-100 dark:border-rose-900/30 rounded-2xl hover:bg-rose-100 dark:hover:bg-rose-900/20 transition-all hover:scale-110 active:scale-95"
            title="Reset All Data"
          >
            <RefreshCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
