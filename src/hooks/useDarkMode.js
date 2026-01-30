import { useState, useEffect } from 'react';

export function useDarkMode() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('academic-merit-dark');
        return saved === null ? true : saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('academic-merit-dark', isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            document.body.style.backgroundColor = '#020617';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.backgroundColor = '#f8fafc';
        }
    }, [isDarkMode]);

    return [isDarkMode, setIsDarkMode];
}
