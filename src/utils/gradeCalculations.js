import { getGradeValue } from './calculator.js';

export function getGradePoints(grade) {
    return getGradeValue(grade);
}

export function calculateDetailedGPA(semesters) {
    const semesterGPAs = semesters.map(sem => {
        const credits = sem.courses.reduce((acc, c) => acc + (Number(c.credits) || 0), 0);
        const points = sem.courses.reduce((acc, c) => acc + (getGradeValue(c.grade) * (Number(c.credits) || 0)), 0);
        return {
            gpa: credits > 0 ? (points / credits).toFixed(2) : '0.00',
            credits
        };
    });

    const currentCredits = semesterGPAs.reduce((acc, s) => acc + s.credits, 0);
    const currentPoints = semesters.reduce((acc, sem) =>
        acc + sem.courses.reduce((cAcc, c) => cAcc + (getGradeValue(c.grade) * (Number(c.credits) || 0)), 0)
        , 0);

    const cgpa = currentCredits > 0 ? (currentPoints / currentCredits).toFixed(2) : '0.00';

    return { cgpa, credits: currentCredits, semesterGPAs };
}

export function calculateQuickGPA(quickSemesters) {
    const activeQuickSemesters = quickSemesters.filter(s => s.gpa !== '' || s.credits !== '');
    const semesterGPAs = activeQuickSemesters.map(s => ({
        gpa: (Number(s.gpa) || 0).toFixed(2),
        credits: Number(s.credits) || 0
    }));

    const totalPoints = activeQuickSemesters.reduce((acc, s) => acc + (Number(s.gpa) || 0) * (Number(s.credits) || 0), 0);
    const totalCredits = activeQuickSemesters.reduce((acc, s) => acc + (Number(s.credits) || 0), 0);
    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

    return { cgpa, credits: totalCredits, semesterGPAs };
}
