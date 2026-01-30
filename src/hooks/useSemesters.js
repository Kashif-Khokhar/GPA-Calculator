import { useState, useCallback } from 'react';
import { getGradeFromPercentage } from '../utils/calculator.js';

export function useSemesters() {
    const [semesters, setSemesters] = useState([
        { id: 1, term: 'Academic Term', courses: [{ id: 1, name: '', grade: '', credits: '', marks: '' }] }
    ]);

    const addSemester = useCallback(() => {
        setSemesters(prev => [...prev, {
            id: Math.max(...prev.map(s => s.id), 0) + 1,
            term: 'Academic Term',
            courses: [{ id: 1, name: '', grade: '', credits: '', marks: '' }]
        }]);
    }, []);

    const removeSemester = useCallback((id) => {
        setSemesters(prev => {
            if (prev.length > 1) {
                return prev.filter(sem => sem.id !== id);
            }
            return prev;
        });
    }, []);

    const updateSemesterTerm = useCallback((semesterIndex, newTerm) => {
        setSemesters(prev => {
            const newSemesters = [...prev];
            newSemesters[semesterIndex] = {
                ...newSemesters[semesterIndex],
                term: newTerm
            };
            return newSemesters;
        });
    }, []);

    const updateSemester = useCallback((semesterIndex, courseIndex, field, value) => {
        setSemesters(prev => {
            const newSemesters = [...prev];
            const currentCourse = { ...newSemesters[semesterIndex].courses[courseIndex] };

            // Auto-assign grade if marks are changed
            if (field === 'marks') {
                const autoGrade = getGradeFromPercentage(value);
                currentCourse.grade = autoGrade;
            }

            currentCourse[field] = value;

            newSemesters[semesterIndex] = {
                ...newSemesters[semesterIndex],
                courses: [...newSemesters[semesterIndex].courses]
            };
            newSemesters[semesterIndex].courses[courseIndex] = currentCourse;

            return newSemesters;
        });
    }, []);

    const addCourseToSemester = useCallback((semesterIndex) => {
        setSemesters(prev => {
            const newSemesters = [...prev];
            newSemesters[semesterIndex] = {
                ...newSemesters[semesterIndex],
                courses: [...newSemesters[semesterIndex].courses]
            };
            const maxId = Math.max(...newSemesters[semesterIndex].courses.map(c => c.id), 0);
            newSemesters[semesterIndex].courses.push({
                id: maxId + 1,
                name: '',
                grade: '',
                credits: '',
                marks: ''
            });
            return newSemesters;
        });
    }, []);

    const removeCourseFromSemester = useCallback((semesterIndex, courseIndex) => {
        setSemesters(prev => {
            const newSemesters = [...prev];
            // Ensure we don't remove the last course from a semester
            if (newSemesters[semesterIndex].courses.length <= 1) {
                return prev; // Prevent removal if only one course exists
            }
            newSemesters[semesterIndex] = {
                ...newSemesters[semesterIndex],
                courses: newSemesters[semesterIndex].courses.filter((_, i) => i !== courseIndex)
            };
            return newSemesters;
        });
    }, []);

    const resetSemesters = useCallback(() => {
        setSemesters([{ id: 1, term: 'Academic Term', courses: [{ id: 1, name: '', grade: '', credits: '', marks: '' }] }]);
    }, []);

    return {
        semesters,
        setSemesters,
        addSemester,
        removeSemester,
        updateSemester,
        updateSemesterTerm,
        addCourseToSemester,
        removeCourseFromSemester,
        resetSemesters
    };
}
