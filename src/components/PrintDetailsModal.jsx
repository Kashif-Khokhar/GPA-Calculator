import React, { useState } from 'react';
import { X, User, Hash, School, BookOpen, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PrintDetailsModal = ({ isOpen, onClose, onConfirm }) => {
  const [details, setDetails] = useState({
    name: '',
    rollNo: '',
    department: '',
    program: '',
    fatherName: '',
    registrationNo: '',
    batch: '',
    shift: 'Morning'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(details);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                  <Printer className="w-7 h-7 text-brand-600" />
                  Print Settings
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">Enter details for your result card.</p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all cursor-pointer"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Student Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      required
                      type="text"
                      className="input-field pl-11 !rounded-2xl"
                      placeholder="e.g. Kashif Ali"
                      value={details.name}
                      onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Roll No.</label>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      required
                      type="text"
                      className="input-field pl-11 !rounded-2xl"
                      placeholder="e.g. SU92-BSCSM..."
                      value={details.rollNo}
                      onChange={(e) => setDetails({ ...details, rollNo: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Department</label>
                  <div className="relative group">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      required
                      type="text"
                      className="input-field pl-11 !rounded-2xl"
                      placeholder="Computer Science"
                      value={details.department}
                      onChange={(e) => setDetails({ ...details, department: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Program</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
                    <input
                      required
                      type="text"
                      className="input-field pl-11 !rounded-2xl"
                      placeholder="BS Computer Science"
                      value={details.program}
                      onChange={(e) => setDetails({ ...details, program: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-600 text-white rounded-[1.5rem] font-bold shadow-xl shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
              >
                <Printer className="w-5 h-5" />
                Generate Result Card
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
