export const calculateGPA = (courses) => {
    const validCourses = courses.filter(
        (course) => course.grade > 0 && course.credits > 0
    );

    if (validCourses.length === 0) return 0;

    const totalPoints = validCourses.reduce(
        (acc, course) => acc + course.grade * course.credits,
        0
    );
    const totalCredits = validCourses.reduce(
        (acc, course) => acc + Number(course.credits),
        0
    );

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

export const calculateCGPA = (currentGPA, currentCredits, prevPoints, prevCredits) => {
    const totalPoints = (Number(currentGPA) * Number(currentCredits)) + Number(prevPoints);
    const totalCredits = Number(currentCredits) + Number(prevCredits);

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
};

export const getGradeValue = (grade) => {
    const grades = {
        'A': 4.0,
        'A-': 3.67,
        'B+': 3.33,
        'B': 3.0,
        'B-': 2.67,
        'C+': 2.33,
        'C': 2.0,
        'C-': 1.67,
        'D+': 1.33,
        'D': 1.0,
        'F': 0.0
    };
    return grades[grade] || 0;
};

export const getGradeFromPercentage = (percentage) => {
    if (!percentage || percentage === '') return '';
    const p = Number(percentage);
    if (p >= 85) return 'A';
    if (p >= 80) return 'A-';
    if (p >= 75) return 'B+';
    if (p >= 71) return 'B';
    if (p >= 68) return 'B-';
    if (p >= 64) return 'C+';
    if (p >= 61) return 'C';
    if (p >= 58) return 'C-';
    if (p >= 54) return 'D+';
    if (p >= 50) return 'D';
    return 'F';
};
