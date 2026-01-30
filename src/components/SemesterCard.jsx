import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { CourseRow } from './CourseRow.jsx';
import { getGradePoints } from '../utils/gradeCalculations.js';

export const SemesterCard = ({ semester, onUpdate, onRemove, onAddCourse, onRemoveCourse, semesterIndex }) => {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate semester GPA
  const totalCredits = semester.courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
  const totalPoints = semester.courses.reduce((acc, c) => 
    acc + (getGradePoints(c.grade) * (Number(c.credits) || 0)), 0
  );
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <section className="glass rounded-3xl overflow-hidden mb-6 group-semester">
      <div 
        className="p-6 cursor-pointer flex items-center justify-between hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-xl flex items-center justify-center font-bold">
            {semesterIndex + 1}
          </div>
          <div>
            <h2 className="text-xl font-bold transition-all">Semester {semesterIndex + 1}</h2>
            <div className="flex gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
              <span>GPA: <span className="text-brand-600 dark:text-brand-400 font-extrabold">{sgpa}</span></span>
              <span>Credits: <span className="text-slate-700 dark:text-slate-300 font-extrabold">{totalCredits}</span></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all cursor-pointer hover:scale-110"
            title="Delete Semester"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <div className="p-2 text-slate-400">
            {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-12 gap-3 px-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">
                <div className="col-span-5">Course Name</div>
                <div className="col-span-2">Marks %</div>
                <div className="col-span-2">Grade</div>
                <div className="col-span-2 text-center">Cr.</div>
              </div>
              
              {semester.courses.map((course, courseIndex) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  onUpdate={(field, value) => onUpdate(courseIndex, field, value)}
                  onRemove={() => onRemoveCourse(courseIndex)}
                />
              ))}

              <button
                onClick={onAddCourse}
                className="w-full py-3 mt-2 border-2 border-dashed border-brand-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-brand-600 hover:border-brand-300 dark:hover:border-brand-900 transition-all flex items-center justify-center gap-2 font-semibold text-sm cursor-pointer hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
