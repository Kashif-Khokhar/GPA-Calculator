import React from 'react';
import { getGradePoints } from '../utils/gradeCalculations.js';

export const PrintReport = ({ details, semesters, cumulativeResults }) => {
  // Ensure we have valid data
  const validDetails = details || {};
  const validSemesters = Array.isArray(semesters) ? semesters : [];
  
  // Calculate cumulative CGPA for each semester
  const calculateCumulativeCGPA = (semesterIndex) => {
    let totalCredits = 0;
    let totalPoints = 0;
    
    for (let i = 0; i <= semesterIndex; i++) {
      const sem = validSemesters[i];
      if (sem && sem.courses) {
        sem.courses.forEach(course => {
          const credits = Number(course.credits) || 0;
          const points = getGradePoints(course.grade) * credits;
          totalCredits += credits;
          totalPoints += points;
        });
      }
    }
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };
    // Debug logging
  console.log('=== PRINT REPORT DEBUG ===');
  console.log('Details received:', validDetails);
  console.log('Semesters count:', validSemesters.length);
  console.log('Semesters data:', validSemesters);
  
  return (
    <div id="print-report" className="fixed inset-0 invisible print:visible print:relative print:inset-auto bg-gradient-to-br from-slate-50 via-white to-blue-50 text-black p-10 min-h-screen z-[9999]">
      {/* Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-brand-600/10 to-transparent rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-bl-full"></div>
      
      {/* University Header */}
      <div className="relative text-center mb-12 pb-8 border-b-4 border-double border-brand-600">
        {/* Elegant Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-brand-600 to-blue-600 rounded-full blur-3xl"></div>
        </div>
        
        {/* University Logo */}
        <div className="relative mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-white ring-4 ring-brand-200">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
        </div>
        
        {/* University Name */}
        <h1 className="relative text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-800 via-brand-600 to-blue-700 uppercase tracking-tight mb-3 drop-shadow-sm">
          The Superior University
        </h1>
        <p className="text-xl font-semibold text-brand-700 tracking-wide mb-4">Lahore, Pakistan</p>
        
        {/* Document Title */}
        <div className="relative inline-block mt-6">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-blue-600 blur-sm opacity-20"></div>
          <div className="relative bg-gradient-to-r from-brand-700 via-brand-600 to-blue-700 text-white px-12 py-3 font-bold text-lg uppercase tracking-widest shadow-xl">
            Academic Transcript
          </div>
        </div>
      </div>

      {/* Student Details Section */}
      <div className="mb-10 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-6 py-3">
          <h2 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
            Student Information
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-x-16 gap-y-4 p-8">
          <div className="flex items-start gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-purple-700 font-bold text-sm">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Student Name</p>
              <p className="text-lg font-bold text-slate-900 uppercase">{validDetails.name}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-blue-700 font-bold text-sm">📚</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</p>
              <p className="text-lg font-bold text-slate-900">{validDetails.department}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-brand-700 font-bold text-sm">ID</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Roll Number</p>
              <p className="text-lg font-bold text-slate-900">{validDetails.rollNo}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 group">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-green-700 font-bold text-sm">🎓</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Program</p>
              <p className="text-lg font-bold text-slate-900">{validDetails.program}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Results Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-blue-600 blur-sm opacity-20"></div>
        <div className="relative bg-gradient-to-r from-brand-700 to-blue-700 text-white text-center py-3 font-bold uppercase tracking-widest text-base shadow-lg">
          📊 Academic Performance Record
        </div>
      </div>

      {/* Semester Tables */}
      {validSemesters.map((semester, idx) => {
        const totalCredits = semester.courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
        const totalPoints = semester.courses.reduce((acc, c) => 
          acc + (getGradePoints(c.grade) * (Number(c.credits) || 0)), 0
        );
        const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        const totalMarks = semester.courses.reduce((acc, c) => {
          const credits = Number(c.credits) || 0;
          const marks = Number(c.marks) || 0;
          return acc + (marks * credits);
        }, 0);
        const averageMarks = totalCredits > 0 ? (totalMarks / totalCredits).toFixed(1) : '0.0';
        
        return (
          <div key={idx} className="mb-12 avoid-break bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Semester Header */}
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-black text-lg">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-wide">Semester {idx + 1}</h3>
                  <p className="text-xs text-slate-300">Academic Term</p>
                </div>
              </div>
              <div className="flex gap-8">
                <div className="text-right">
                  <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">SGPA</p>
                  <p className="text-2xl font-black text-yellow-300">{sgpa}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-300 uppercase tracking-wider mb-1">CGPA</p>
                  <p className="text-2xl font-black text-green-300">{calculateCumulativeCGPA(idx)}</p>
                </div>
              </div>
            </div>
            
            {/* Course Table */}
            <div className="overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                    <th className="border-y-2 border-slate-300 px-4 py-3 text-center font-bold text-slate-700 w-16">Sr#</th>
                    <th className="border-y-2 border-slate-300 px-4 py-3 text-left font-bold text-slate-700">Course Title</th>
                    <th className="border-y-2 border-slate-300 px-4 py-3 text-center font-bold text-slate-700 w-24">Credit Hrs</th>
                    <th className="border-y-2 border-slate-300 px-4 py-3 text-center font-bold text-slate-700 w-24">Marks %</th>
                    <th className="border-y-2 border-slate-300 px-4 py-3 text-center font-bold text-slate-700 w-20">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, cIdx) => (
                    <tr key={cIdx} className={`${cIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-brand-50/30 transition-colors`}>
                      <td className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-600">{cIdx + 1}</td>
                      <td className="border-b border-slate-200 px-4 py-3 text-slate-800">{course.name}</td>
                      <td className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-700">{(Number(course.credits) || 0).toFixed(1)}</td>
                      <td className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-blue-700">{course.marks || '0'}%</td>
                      <td className="border-b border-slate-200 px-4 py-3 text-center">
                        <span className="inline-block px-3 py-1 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-black rounded-lg shadow-sm">
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-slate-200 to-slate-100 font-bold">
                    <td colSpan="2" className="border-t-2 border-slate-400 px-4 py-4 text-right text-slate-800 uppercase tracking-wide">Semester Total</td>
                    <td className="border-t-2 border-slate-400 px-4 py-4 text-center text-brand-700 text-lg font-black">{totalCredits.toFixed(1)}</td>
                    <td className="border-t-2 border-slate-400 px-4 py-4 text-center text-blue-700 text-lg font-black">{averageMarks}%</td>
                    <td className="border-t-2 border-slate-400 px-4 py-4 text-center text-slate-500">---</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })}

      {/* Final Footer */}
      <div className="mt-16 pt-8 border-t-2 border-slate-300">
        <div className="flex justify-between items-end">
          {/* Document Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <svg className="w-4 h-4 text-brand-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              <span className="italic">This is a computer-generated transcript and does not require a signature.</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="font-semibold">Generated on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Signature Section */}
          <div className="text-center">
            <div className="w-56 mb-3">
              <div className="h-16 flex items-center justify-center mb-2">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-600 italic" style={{fontFamily: 'cursive'}}>
                  Authorized
                </div>
              </div>
              <div className="border-t-2 border-slate-800 mb-2"></div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Controller of Examinations</p>
              <p className="text-[10px] text-slate-500 mt-1">The Superior University, Lahore</p>
            </div>
          </div>
        </div>
      </div>

      {/* Developer and Website Reference */}
      <div className="mt-6 flex flex-col items-center gap-1 text-[10px] text-slate-400 font-medium">
        <p>Developed by <span className="text-brand-600 font-bold">Kashif Khokhar</span></p>
        <p className="tracking-widest uppercase">https://gpa-calculator-chi-gilt.vercel.app/</p>
      </div>
      
      {/* Decorative Bottom Border */}
      <div className="mt-4 h-2 bg-gradient-to-r from-brand-600 via-blue-600 to-brand-600 rounded-full"></div>
    </div>
  );
};
