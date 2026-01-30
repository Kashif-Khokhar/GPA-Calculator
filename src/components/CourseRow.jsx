import React from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { GRADES } from '../constants/grades.js';

export const CourseRow = ({ course, onUpdate, onRemove }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.98 }}
    className="grid grid-cols-12 gap-3 items-center group"
  >
    <div className="col-span-12 md:col-span-5">
      <input
        type="text"
        placeholder="Course Name"
        className="input-field text-sm text-slate-900 dark:text-slate-100"
        value={course.name}
        onChange={(e) => onUpdate('name', e.target.value)}
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <input
        type="number"
        placeholder="Marks %"
        className="input-field text-sm text-slate-900 dark:text-slate-100"
        value={course.marks}
        onChange={(e) => onUpdate('marks', e.target.value)}
      />
    </div>
    <div className="col-span-4 md:col-span-2">
      <select
        className="input-field text-sm appearance-none font-bold text-brand-600 dark:text-brand-400"
        value={course.grade}
        onChange={(e) => onUpdate('grade', e.target.value)}
      >
        <option value="">Grade</option>
        {GRADES.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
    </div>
    <div className="col-span-3 md:col-span-2">
      <input
        type="number"
        placeholder="Credits"
        className="input-field text-sm text-center text-slate-900 dark:text-slate-100"
        value={course.credits}
        onChange={(e) => onUpdate('credits', e.target.value)}
      />
    </div>
    <div className="col-span-1 flex justify-center print:hidden">
      <button
        onClick={onRemove}
        className="p-2 text-slate-300 hover:text-rose-500 transition-all cursor-pointer hover:scale-110"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
);
