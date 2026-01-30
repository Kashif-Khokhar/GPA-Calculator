import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export const QuickSemesterRow = ({ semester, onUpdate, onRemove, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    className="grid grid-cols-12 gap-4 items-end glass p-5 rounded-2xl group"
  >
    <div className="col-span-2">
      <div className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1">Sem #</div>
      <div className="h-10 flex items-center justify-center bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl font-bold">
        {index + 1}
      </div>
    </div>
    <div className="col-span-5">
      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block">Semester GPA</label>
      <input 
        type="number"
        step="0.01"
        placeholder="0.00"
        className="input-field font-bold"
        value={semester.gpa}
        onChange={(e) => onUpdate('gpa', e.target.value)}
      />
    </div>
    <div className="col-span-4">
      <label className="text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 block">Credit Hours</label>
      <input 
        type="number"
        placeholder="0"
        className="input-field font-bold"
        value={semester.credits}
        onChange={(e) => onUpdate('credits', e.target.value)}
      />
    </div>
    <div className="col-span-1 pb-1 flex justify-center">
       <button onClick={onRemove} className="p-2 text-slate-300 hover:text-rose-500 transition-all cursor-pointer hover:scale-110">
          <Trash2 className="w-5 h-5" />
       </button>
    </div>
  </motion.div>
);
