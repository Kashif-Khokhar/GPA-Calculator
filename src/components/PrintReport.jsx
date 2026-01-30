import React from 'react';
import { getGradePoints } from '../utils/gradeCalculations.js';

export const PrintReport = ({ details, semesters, cumulativeResults }) => {
  return (
    <div id="print-report" className="hidden print:block bg-white text-black p-8 min-h-screen font-serif">
      {/* University Header */}
      <div className="text-center mb-10 border-b-2 border-brand-600 pb-6 relative">
        <div className="absolute left-0 top-0 w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center border border-brand-100">
           {/* Placeholder for University Logo */}
           <div className="w-12 h-12 bg-brand-600 rounded-full"></div>
        </div>
        <h1 className="text-4xl font-extrabold text-brand-800 uppercase tracking-tight">The Superior University Lahore</h1>
        <div className="mt-4 font-bold text-lg border-y border-slate-200 py-1 uppercase tracking-widest text-slate-700">
            To Whom It May Concern
        </div>
      </div>

      {/* Student Details Grid */}
      <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-8 text-sm px-4">
        <div className="grid grid-cols-3 border-b border-slate-100 pb-1">
          <span className="font-bold">Roll No.</span>
          <span className="col-span-2">: {details.rollNo}</span>
        </div>
        <div className="grid grid-cols-3 border-b border-slate-100 pb-1">
          <span className="font-bold">Department</span>
          <span className="col-span-2">: {details.department}</span>
        </div>
        <div className="grid grid-cols-3 border-b border-slate-100 pb-1">
          <span className="font-bold">Name</span>
          <span className="col-span-2 uppercase">: {details.name}</span>
        </div>
        <div className="grid grid-cols-3 border-b border-slate-100 pb-1">
          <span className="font-bold">Program</span>
          <span className="col-span-2">: {details.program}</span>
        </div>
      </div>

      <div className="bg-brand-700 text-white text-center py-1.5 font-bold uppercase tracking-wider text-sm mb-4">
          Academic Result
      </div>

      {/* Semester Tables */}
      {semesters.map((semester, idx) => {
        const totalCredits = semester.courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
        const totalPoints = semester.courses.reduce((acc, c) => 
          acc + (getGradePoints(c.grade) * (Number(c.credits) || 0)), 0
        );
        const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        
        return (
          <div key={idx} className="mb-10 avoid-break">
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="font-bold text-brand-800">Term: SEMESTER {idx + 1}</span>
                <div className="flex gap-6 font-bold text-xs uppercase">
                    <span>SGPA: {sgpa}</span>
                    <span>CGPA: {cumulativeResults?.semesterGPAs?.[idx]?.gpa || sgpa}</span>
                </div>
            </div>
            
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300">
                  <th className="border border-slate-300 p-2 text-center w-12">Sr#</th>
                  <th className="border border-slate-300 p-2 text-left w-32">Course Code</th>
                  <th className="border border-slate-300 p-2 text-left">Course Title</th>
                  <th className="border border-slate-300 p-2 text-center w-20">Credit Hrs</th>
                  <th className="border border-slate-300 p-2 text-center w-20">Marks %</th>
                  <th className="border border-slate-300 p-2 text-center w-16">Grade</th>
                </tr>
              </thead>
              <tbody>
                {semester.courses.map((course, cIdx) => (
                  <tr key={cIdx} className="border-b border-slate-200">
                    <td className="border border-slate-300 p-2 text-center">{cIdx + 1}</td>
                    <td className="border border-slate-300 p-2 uppercase">{course.code || '---'}</td>
                    <td className="border border-slate-300 p-2">{course.name}</td>
                    <td className="border border-slate-300 p-2 text-center">{(Number(course.credits) || 0).toFixed(2)}</td>
                    <td className="border border-slate-300 p-2 text-center">{course.marks || '0'}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold">{course.grade}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t border-slate-300">
                  <td colSpan="3" className="border border-slate-300 p-2 text-right">Total</td>
                  <td className="border border-slate-300 p-2 text-center">{totalCredits.toFixed(2)}</td>
                  <td className="border border-slate-300 p-2 text-center">---</td>
                  <td className="border border-slate-300 p-2 text-center">---</td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}

      {/* Final Footer */}
      <div className="mt-12 pt-8 border-t-2 border-slate-200">
         <div className="flex justify-between items-end">
            <div className="space-y-1 text-xs text-slate-500 italic">
                <p>* This is a computer generated result.</p>
                <p>* Generated on: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-center w-48">
                <div className="border-b border-black mb-1"></div>
                <p className="text-[10px] font-bold uppercase">Controller of Examinations</p>
            </div>
         </div>
      </div>
    </div>
  );
};
