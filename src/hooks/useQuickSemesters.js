import { useState, useCallback } from 'react';

export function useQuickSemesters() {
    const [quickSemesters, setQuickSemesters] = useState([
        { id: 1, gpa: '', credits: '' }
    ]);

    const addQuickSemester = useCallback(() => {
        setQuickSemesters(prev => {
            const maxId = Math.max(...prev.map(s => s.id), 0);
            return [...prev, { id: maxId + 1, gpa: '', credits: '' }];
        });
    }, []);

    const removeQuickSemester = useCallback((id) => {
        setQuickSemesters(prev => {
            if (prev.length > 1) {
                return prev.filter(sem => sem.id !== id);
            }
            return prev;
        });
    }, []);

    const updateQuickSemester = useCallback((id, field, value) => {
        setQuickSemesters(prev => prev.map(sem =>
            sem.id === id ? { ...sem, [field]: value } : sem
        ));
    }, []);

    const resetQuickSemesters = useCallback(() => {
        setQuickSemesters([{ id: 1, gpa: '', credits: '' }]);
    }, []);

    return {
        quickSemesters,
        setQuickSemesters,
        addQuickSemester,
        removeQuickSemester,
        updateQuickSemester,
        resetQuickSemesters
    };
}
