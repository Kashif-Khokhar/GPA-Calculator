import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Calculator, LayoutGrid, Zap, Github, Linkedin, 
  Mail, GraduationCap, Info, RefreshCcw, X, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { SemesterCard } from './components/SemesterCard.jsx';
import { QuickSemesterRow } from './components/QuickSemesterRow.jsx';
import { Header } from './components/Header.jsx';
import { ResultsDisplay } from './components/ResultsDisplay.jsx';
import { PrintDetailsModal } from './components/PrintDetailsModal.jsx';
import { PrintReport } from './components/PrintReport.jsx';

// Hooks
import { useDarkMode } from './hooks/useDarkMode.js';
import { useSemesters } from './hooks/useSemesters.js';
import { useQuickSemesters } from './hooks/useQuickSemesters.js';

// Utils
import { parsePDFFile } from './utils/pdfParser.js';
import { calculateDetailedGPA, calculateQuickGPA } from './utils/gradeCalculations.js';



const App = () => {
  // Custom Hooks
  const [isDarkMode, setIsDarkMode] = useDarkMode();
    const {
    semesters,
    setSemesters,
    addSemester,
    removeSemester,
    updateSemester,
    updateSemesterTerm,
    addCourseToSemester,
    removeCourseFromSemester,
    resetSemesters
  } = useSemesters();
  const {
    quickSemesters,
    addQuickSemester,
    removeQuickSemester,
    updateQuickSemester,
    resetQuickSemesters
  } = useQuickSemesters();

  // Local State
  const [activeTab, setActiveTab] = useState('detailed');
  const [results, setResults] = useState({ cgpa: '0.00', credits: 0, semesterGPAs: [] });
  const [showGradingScale, setShowGradingScale] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteSemester, setShowDeleteSemester] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printDetails, setPrintDetails] = useState(null);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResults({ cgpa: '0.00', credits: 0, semesterGPAs: [] });
    resetSemesters();
    resetQuickSemesters();
  };

  // Unified Calculate Handler
  const handleCalculate = () => {
    if (activeTab === 'detailed') {
      const result = calculateDetailedGPA(semesters);
      setResults(result);
    } else {
      const result = calculateQuickGPA(quickSemesters);
      setResults(result);
    }

    // Feedback & Smooth Scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDeleteSemester = () => {
    if (showDeleteSemester) {
      if (activeTab === 'detailed') {
        removeSemester(showDeleteSemester);
      } else {
        removeQuickSemester(showDeleteSemester);
      }
      setResults({ cgpa: '0.00', credits: 0, semesterGPAs: [] });
      setShowDeleteSemester(null);
    }
  };

  const resetAll = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    resetSemesters();
    resetQuickSemesters();
    setResults({ cgpa: '0.00', credits: 0, semesterGPAs: [] });
    setShowResetConfirm(false);
  };

  // File Import Functionality
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please upload a valid PDF result file.'
      });
      return;
    }

    try {
      const parsedSemesters = await parsePDFFile(file);
      
      if (parsedSemesters.length > 0) {
        const totalCourses = parsedSemesters.reduce((sum, sem) => sum + sem.courses.length, 0);
        
        setSemesters(parsedSemesters);
        setResults({ cgpa: '0.00', credits: 0, semesterGPAs: [] });
        
        setNotification({
          type: 'success',
          title: 'Successfully Imported!',
          message: 'Your academic data has been successfully loaded.',
          stats: {
            semesters: parsedSemesters.length,
            courses: totalCourses
          },
          cta: 'Click "Calculate GPA" to see your results.'
        });
      } else {
        setNotification({
          type: 'error',
          title: 'Import Failed',
          message: 'No semester data was found in this PDF.',
          details: [
            'Ensure the PDF contains result data',
            'Check if the file is encrypted or protected'
          ]
        });
      }
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error parsing PDF:', error);
      setNotification({
        type: 'error',
        title: 'Parsing Error',
        message: 'Failed to process the PDF. It might be a scanned image or an unsupported format.'
      });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onShowGradingScale={() => setShowGradingScale(true)}
          onImportClick={handleImportClick}
          onExport={() => setShowPrintModal(true)}
          onReset={resetAll}
        />

        {/* Hidden File Input for PDF Import */}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Global Summary Card & Previous Stats */}
        <ResultsDisplay 
          results={results}
          activeTab={activeTab}
          isDarkMode={isDarkMode}
        />

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === 'detailed' ? (
            <>
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <LayoutGrid className="w-5 h-5 text-brand-600" />
                   <h2 className="text-xl sm:text-2xl font-bold">GPA Calculator</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button
                        onClick={addSemester}
                        className="btn-secondary flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 sm:px-6"
                    >
                        <Plus className="w-5 h-5" />
                        Add Semester
                    </button>
                    <button
                        onClick={handleCalculate}
                        className="btn-primary flex items-center justify-center gap-2 sm:gap-3 py-2.5 sm:py-3 px-6 sm:px-8 shadow-2xl shadow-brand-500/30 transform transition-all hover:scale-105 active:scale-95"
                    >
                        <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Calculate GPA</span>
                    </button>
                </div>
              </div>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {semesters.map((sem, idx) => (
                    <SemesterCard
                      key={sem.id}
                      semester={sem}
                      semesterIndex={idx}
                      onUpdate={(courseIdx, field, value) => updateSemester(idx, courseIdx, field, value)}
                      onUpdateTerm={(newTerm) => updateSemesterTerm(idx, newTerm)}
                      onRemove={() => setShowDeleteSemester(sem.id)}
                      onAddCourse={() => addCourseToSemester(idx)}
                      onRemoveCourse={(courseIdx) => removeCourseFromSemester(idx, courseIdx)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="space-y-8 animate-slide-up">
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-brand-600" />
                    <h2 className="text-xl sm:text-2xl font-bold">CGPA Calculator</h2>
                  </div>
                  <button
                    onClick={addQuickSemester}
                    className="btn-secondary flex items-center gap-2 border-brand-200 dark:border-slate-800"
                  >
                    <Plus className="w-5 h-5" />
                    Add Semester
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {quickSemesters.map((s, idx) => (
                      <QuickSemesterRow 
                        key={s.id}
                        index={idx}
                        semester={s}
                        onUpdate={(field, val) => updateQuickSemester(s.id, field, val)}
                        onRemove={() => setShowDeleteSemester(s.id)}
                      />
                    ))}
                  </AnimatePresence>
               </div>

               <div className="flex justify-center pt-4">
                  <button 
                    onClick={handleCalculate}
                    className="px-12 py-4 bg-brand-600 text-white rounded-[2rem] font-black text-lg tracking-wider shadow-2xl shadow-brand-500/40 transform transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    <Calculator className="w-6 h-6" />
                    Calculate CGPA
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-12 space-y-6 print:hidden">
          <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 mx-auto rounded-full"></div>
          
          {/* Quote */}
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm italic">"Excellence is not a skill. It is an attitude."</p>
          
          {/* Developer Info */}
          <div className="space-y-3">
            <p className="text-slate-600 dark:text-slate-400 font-semibold text-sm">
              Developed with ❤️ by <span className="text-brand-600 dark:text-brand-400 font-bold">Kashif Khokhar</span>
            </p>
            
            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://github.com/Kashif-Khokhar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 transition-all hover:scale-110"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/kashif-ali-khokhar/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 transition-all hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:kashifkhokhar1199@gmail.com" 
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-brand-100 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 transition-all hover:scale-110"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Version */}
          <div className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
            Superior GPA Calculator v1.0
          </div>
        </footer>

        {/* Grading Scale Modal */}
        <AnimatePresence>
          {showGradingScale && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gradient-to-br from-black/80 via-slate-900/70 to-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
              onClick={() => setShowGradingScale(false)}
            >
              {/* Floating Particles Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
              </div>

              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 30 }}
                transition={{ type: "spring", damping: 20, stiffness: 250 }}
                className="relative glass rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl shadow-brand-500/30 border-2 border-white/20 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
                }}
              >
                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400 opacity-20 blur-xl animate-pulse pointer-events-none"></div>
                
                {/* Premium Gradient Header */}
                <div className="sticky top-0 bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 p-8 z-10 relative overflow-hidden">
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] animate-pulse"></div>
                  </div>
                  
                  {/* Floating Orbs */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                  
                  <div className="flex items-center justify-between relative">
                    <div className="flex items-center gap-5">
                      <motion.div 
                        initial={{ rotate: -15, scale: 0.7 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/25 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/40">
                          <Info className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-2xl" />
                        </div>
                      </motion.div>
                      <div>
                        <motion.h2 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-2xl tracking-tight"
                        >
                          Superior University
                        </motion.h2>
                        <motion.p 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-base sm:text-lg md:text-xl font-bold text-white/95 mt-1 drop-shadow-lg"
                        >
                          Grading System & Scale
                        </motion.p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 90 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setShowGradingScale(false)}
                      className="relative group cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-xl blur-lg group-hover:bg-white/30 transition-all"></div>
                      <div className="relative p-2.5 sm:p-3.5 bg-white/25 hover:bg-white/35 backdrop-blur-md rounded-xl transition-all border-2 border-white/40 shadow-xl">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Scrollable Content with Custom Scrollbar */}
                <div className="overflow-y-auto max-h-[calc(90vh-160px)] bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 scroll-smooth">
                  <div className="p-5 sm:p-7 md:p-10 space-y-6 sm:space-y-8 md:space-y-10">
                    {/* Grading Scale Image with Premium Frame */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-500 rounded-[2rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-2 ring-white/50 dark:ring-slate-700/50 transform group-hover:scale-[1.02] transition-transform duration-500">
                        <img 
                          src="/grading-scale.png" 
                          alt="Superior University Grading System" 
                          className="w-full h-auto"
                        />
                      </div>
                    </motion.div>

                    {/* Ultra-Premium Table */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="relative group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400 rounded-[1.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                      <div className="relative overflow-hidden rounded-[1.5rem] shadow-2xl ring-2 ring-white/50 dark:ring-slate-700/50 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gradient-to-r from-brand-600 via-purple-600 to-brand-600 text-white relative backdrop-blur-sm">
                                <th className="relative px-8 py-5 text-left font-black text-sm uppercase tracking-widest">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 bg-white/60 rounded-full"></div>
                                    Letter Grade
                                  </div>
                                </th>
                                <th className="relative px-8 py-5 text-center font-black text-sm uppercase tracking-widest">Grade Points</th>
                                <th className="relative px-8 py-5 text-center font-black text-sm uppercase tracking-widest">Marks Range</th>
                                <th className="relative px-8 py-5 text-left font-black text-sm uppercase tracking-widest">Definition</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                              {[
                                { grade: 'A', points: '4.0', range: '85% to 100%', definition: 'Excellent', gradient: 'from-emerald-100 via-emerald-50 to-white dark:from-emerald-900/30 dark:via-emerald-900/15 dark:to-slate-800/50', icon: '🌟' },
                                { grade: 'A-', points: '3.67', range: '80% to 84%', definition: 'Very Good', gradient: 'from-blue-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50', icon: '⭐' },
                                { grade: 'B+', points: '3.33', range: '75% to 79%', definition: 'Good', gradient: 'from-blue-100 via-blue-50 to-white dark:from-blue-900/30 dark:via-blue-900/15 dark:to-slate-800/50', icon: '✨' },
                                { grade: 'B', points: '3.0', range: '71% to 74%', definition: 'Average', gradient: 'from-cyan-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50', icon: '💫' },
                                { grade: 'B-', points: '2.67', range: '68% to 70%', definition: 'Satisfactory', gradient: 'from-cyan-100 via-cyan-50 to-white dark:from-cyan-900/30 dark:via-cyan-900/15 dark:to-slate-800/50', icon: '✓' },
                                { grade: 'C+', points: '2.33', range: '64% to 67%', definition: 'Fair', gradient: 'from-yellow-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50', icon: '○' },
                                { grade: 'C', points: '2.0', range: '61% to 63%', definition: 'Passing', gradient: 'from-amber-100 via-amber-50 to-white dark:from-amber-900/30 dark:via-amber-900/15 dark:to-slate-800/50', icon: '◐' },
                                { grade: 'C-', points: '1.67', range: '58% to 60%', definition: 'Conditional Pass', gradient: 'from-orange-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50', icon: '◑' },
                                { grade: 'D+', points: '1.33', range: '54% to 57%', definition: 'Marginal Pass', gradient: 'from-orange-100 via-orange-50 to-white dark:from-orange-900/30 dark:via-orange-900/15 dark:to-slate-800/50', icon: '◔' },
                                { grade: 'D', points: '1.0', range: '50% to 53%', definition: 'Failing', gradient: 'from-red-50 via-white to-slate-50 dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/50', icon: '●' },
                                { grade: 'F', points: '0.0', range: '0% to 49%', definition: 'Fail', gradient: 'from-rose-100 via-rose-50 to-white dark:from-rose-900/30 dark:via-rose-900/15 dark:to-slate-800/50', icon: '✗' },
                              ].map((row, idx) => (
                                <motion.tr 
                                  key={idx} 
                                  initial={{ opacity: 0, x: -30 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + idx * 0.04, type: "spring", stiffness: 100 }}
                                  className={`bg-gradient-to-r ${row.gradient} border-b border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-default group/row`}
                                >
                                  <td className="px-8 py-5 font-black text-2xl text-brand-600 dark:text-brand-400">
                                    <div className="flex items-center gap-3">
                                      <span className="text-3xl group-hover/row:scale-125 transition-transform">{row.icon}</span>
                                      {row.grade}
                                    </div>
                                  </td>
                                  <td className="px-8 py-5 text-center">
                                    <div className="inline-block px-4 py-2 bg-white/60 dark:bg-slate-700/60 rounded-xl font-bold text-xl text-slate-800 dark:text-slate-200 shadow-sm">
                                      {row.points}
                                    </div>
                                  </td>
                                  <td className="px-8 py-5 text-center font-semibold text-lg text-slate-700 dark:text-slate-300">{row.range}</td>
                                  <td className="px-8 py-5 font-medium text-lg text-slate-700 dark:text-slate-300">{row.definition}</td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>

                    {/* Ultra-Premium Info Box */}
                    <motion.div 
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, type: "spring" }}
                      className="relative overflow-hidden group"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400 rounded-[1.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-brand-900/40 dark:via-slate-800/60 dark:to-purple-900/40 rounded-[1.5rem] p-8 border-2 border-brand-200/50 dark:border-brand-700/50 shadow-xl backdrop-blur-sm">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-300/20 dark:bg-brand-700/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300/20 dark:bg-purple-700/20 rounded-full blur-3xl"></div>
                        <div className="relative flex items-start gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-brand-500/30 rounded-xl blur-lg"></div>
                            <div className="relative w-12 h-12 bg-gradient-to-br from-brand-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl">
                              <Info className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="font-black text-brand-700 dark:text-brand-300 mb-2 text-xl flex items-center gap-2">
                              Important Note
                              <span className="text-2xl">📌</span>
                            </p>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                              This grading system is used for calculating your GPA. The table shows the corresponding grade and grade points for each grade percentage range.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Confirmation Modal */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowResetConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative glass rounded-2xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-white/20 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-red-500/20 animate-pulse"></div>
                
                {/* Warning Icon Header */}
                <div className="relative p-5 sm:p-8 pb-4 sm:pb-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/50 mb-3 sm:mb-4"
                  >
                    <div className="absolute inset-0 bg-rose-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <RefreshCcw className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1.5 sm:mb-2"
                  >
                    Reset Everything?
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium"
                  >
                    Wipe everything? This cannot be undone.
                  </motion.p>
                </div>

                {/* Warning Box */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mx-4 sm:mx-8 mb-4 sm:mb-6 p-3 sm:p-4 bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 rounded-xl sm:rounded-2xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-black">!</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-rose-700 dark:text-rose-300 mb-1">This will delete:</p>
                      <ul className="text-rose-600 dark:text-rose-400 space-y-1 text-xs">
                        <li>• All semester data</li>
                        <li>• All course entries</li>
                        <li>• All calculated results</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="relative p-4 sm:p-8 pt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-lg text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmReset}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-bold hover:from-rose-600 hover:to-red-700 transition-all shadow-2xl shadow-rose-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    Reset All
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Semester Confirmation Modal */}
        <AnimatePresence>
          {showDeleteSemester && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteSemester(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative glass rounded-2xl sm:rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-white/20 dark:border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20 animate-pulse"></div>
                
                {/* Warning Icon Header */}
                <div className="relative p-5 sm:p-8 pb-4 sm:pb-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/50 mb-3 sm:mb-4"
                  >
                    <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                    <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-white relative z-10" />
                  </motion.div>
                  
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-1.5 sm:mb-2"
                  >
                    Delete Semester?
                  </motion.h3>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium"
                  >
                    {activeTab === 'detailed' 
                      ? 'This will permanently delete this semester and all its courses.'
                      : 'This will permanently delete this semester entry.'}
                  </motion.p>
                </div>

                {/* Warning Box */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mx-4 sm:mx-8 mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl sm:rounded-2xl"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm font-black">!</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-orange-700 dark:text-orange-300 mb-1">This action cannot be undone</p>
                      <p className="text-orange-600 dark:text-orange-400 text-xs">
                        {activeTab === 'detailed' 
                          ? 'All course data in this semester will be lost.'
                          : 'GPA and credit hours data for this semester will be lost.'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="relative p-4 sm:p-8 pt-0 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteSemester(null)}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl sm:rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-lg text-sm sm:text-base cursor-pointer"
                  >
                    Keep It
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDeleteSemester}
                    className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl sm:rounded-2xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-2xl shadow-orange-500/50 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Export Components */}
        <PrintDetailsModal 
          isOpen={showPrintModal} 
          onClose={() => setShowPrintModal(false)}
          onConfirm={(details) => {
            setPrintDetails(details);
            setShowPrintModal(false);
            
            // Temporarily clear title to remove it from PDF header
            const originalTitle = document.title;
            document.title = ""; 
            
            // Wait for React to render PrintReport
            setTimeout(() => {
              window.print();
              // Restore title after print dialog closes
              setTimeout(() => {
                document.title = originalTitle;
              }, 1000);
            }, 500);
          }}
        />

        <PrintReport 
          details={printDetails || {}} 
          semesters={semesters}
          cumulativeResults={results}
        />

        {/* Global Notification Modal */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              onClick={() => setNotification(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative glass rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-white/10 p-8 text-center"
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)'
                }}
              >
                {/* Decorative Background */}
                <div className={`absolute top-0 left-0 w-full h-1 ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                
                <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${notification.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                   {notification.type === 'success' ? <Zap className="w-10 h-10" /> : <X className="w-10 h-10" />}
                </div>

                <h3 className="text-2xl font-black text-white mb-2">{notification.title}</h3>
                <p className="text-slate-400 font-medium mb-6">{notification.message}</p>

                {notification.stats && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-900/50 rounded-2xl p-3 border border-white/5">
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Semesters</p>
                      <p className="text-xl font-black text-white">{notification.stats.semesters}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-2xl p-3 border border-white/5">
                      <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Courses</p>
                      <p className="text-xl font-black text-white">{notification.stats.courses}</p>
                    </div>
                  </div>
                )}

                {notification.cta && (
                  <div className="mb-6 p-3 bg-brand-500/10 rounded-xl border border-brand-500/20">
                    <p className="text-xs font-bold text-brand-400">{notification.cta}</p>
                  </div>
                )}

                <button
                  onClick={() => setNotification(null)}
                  className={`w-full py-4 rounded-xl font-black text-lg transition-all active:scale-95 shadow-xl ${
                    notification.type === 'success' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                  }`}
                >
                  Awesome
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
