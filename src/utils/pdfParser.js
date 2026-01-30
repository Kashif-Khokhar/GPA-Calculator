import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - must match installed pdfjs-dist version (5.4.530)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs';

export async function parsePDFFile(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        // Extract text from all pages with better line break detection
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Better text extraction preserving line structure
            let lastY = null;
            let pageText = '';

            textContent.items.forEach((item) => {
                const currentY = item.transform[5];

                // Detect new line based on Y position change
                if (lastY !== null && Math.abs(currentY - lastY) > 5) {
                    pageText += '\n';
                }

                pageText += item.str + ' ';
                lastY = currentY;
            });

            fullText += pageText + '\n';
        }

        console.log('=== PDF IMPORT DEBUG ===');
        console.log('Extracted Text Length:', fullText.length);
        console.log('First 500 chars:', fullText.substring(0, 500));

        // Parse the extracted text
        const parsedSemesters = parseResultText(fullText);

        console.log('Parsed Semesters:', parsedSemesters);

        return parsedSemesters;
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw error;
    }
}

function parseResultText(text) {
    console.log('--- STARTING STATEFUL PARSE ---');
    const semesters = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    let currentSemester = null;
    let semesterIdCounter = 1;
    let pendingCourse = null; // Buffer for multi-line courses

    const createSemester = (term = '') => {
        console.log('Creating semester with term:', term);
        // Extract only the term part (e.g. FALL 2023) and ignore trailing SGPA/CGPA
        const termMatch = term.match(/(?:term:\s*)?([a-z]+\s+\d{4})/i);
        const cleanedTerm = termMatch ? termMatch[1].toUpperCase() : term.replace(/term:/i, '').trim();

        return {
            id: Date.now() + semesterIdCounter++,
            term: cleanedTerm || 'Academic Term',
            courses: []
        };
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lowerLine = line.toLowerCase();
        const parts = line.split(/\s+/);

        // 1. Semester Detection
        const isTermHeader = lowerLine.includes('term:') ||
            /^(fall|spring|summer|winter)\s+\d{4}/i.test(line) ||
            /semester\s+\d+/i.test(line);

        if (isTermHeader) {
            if (currentSemester && currentSemester.courses.length > 0) {
                semesters.push(currentSemester);
            }
            currentSemester = createSemester(line);
            pendingCourse = null;
            continue;
        }

        // 2. Skip Headers & Summary Stats
        const isSkipLine = line.includes('Sr#') ||
            line.includes('Course Code') ||
            (lowerLine.includes('total marks') && !lowerLine.includes('management')) ||
            lowerLine.startsWith('sgpa') ||
            lowerLine.startsWith('cgpa') ||
            line === 'Total' ||
            /^\d{1,2}\.?\d{1,2}\s*%$/.test(line); // Skip percentage lines
        if (isSkipLine) continue;

        // 3. Robust Course Detection
        const gradeIdx = parts.findLastIndex(p => /^[A-F][+-]?$|^[DFPIWSU]$|^EX$/i.test(p));
        // More flexible code match (handle up to 12 chars for mixed codes)
        const codeIdx = parts.findIndex(p => /^[A-Z]{2,5}\d{3,8}|[A-Z\d]{5,12}$/.test(p));

        if (codeIdx >= 0) {
            // New course start detected
            const code = parts[codeIdx];
            const titleStart = codeIdx + 1;

            // Search for numbers before grade
            const nums = [];
            let numSearchEnd = gradeIdx >= 0 ? gradeIdx - 1 : parts.length - 1;
            for (let j = numSearchEnd; j >= titleStart; j--) {
                if (/^\d+\.?\d*$/.test(parts[j])) {
                    nums.push({ val: parts[j], idx: j });
                }
                if (nums.length === 3) break;
            }

            const titleEnd = nums.length > 0 ? nums[nums.length - 1].idx : (gradeIdx >= 0 ? gradeIdx : parts.length);
            const title = parts.slice(titleStart, titleEnd).join(' ');

            pendingCourse = {
                code,
                name: title,
                credits: nums.length >= 2 ? (nums.length === 3 ? nums[2].val : nums[1].val) : '3.0',
                marks: nums.length > 0 ? nums[0].val : '0',
                grade: gradeIdx >= 0 ? parts[gradeIdx].toUpperCase() : null
            };

            // Complete line check
            if (pendingCourse.grade && parseFloat(pendingCourse.credits) < 10) {
                if (!currentSemester) currentSemester = createSemester('Semester 1');
                currentSemester.courses.push({
                    id: Date.now() + Math.random(),
                    name: pendingCourse.name.trim(),
                    grade: pendingCourse.grade,
                    credits: pendingCourse.credits,
                    marks: pendingCourse.marks
                });
                console.log(`Matched (Full): ${pendingCourse.name} [${pendingCourse.grade}]`);
                pendingCourse = null;
            }
        }
        else if (gradeIdx >= 0 && pendingCourse) {
            // Complete pending course
            const nums = [];
            for (let j = gradeIdx - 1; j >= 0; j--) {
                if (/^\d+\.?\d*$/.test(parts[j])) {
                    nums.push({ val: parts[j], idx: j });
                }
                if (nums.length === 3) break;
            }

            const extraTitle = parts.slice(0, nums.length > 0 ? nums[nums.length - 1].idx : gradeIdx).join(' ');
            pendingCourse.name += ' ' + extraTitle;
            pendingCourse.grade = parts[gradeIdx].toUpperCase();

            if (nums.length >= 2) {
                pendingCourse.credits = nums.length === 3 ? nums[2].val : nums[1].val;
                pendingCourse.marks = nums[0].val;
            }

            if (!currentSemester) currentSemester = createSemester('Semester 1');
            currentSemester.courses.push({
                id: Date.now() + Math.random(),
                name: pendingCourse.name.trim(),
                grade: pendingCourse.grade,
                credits: pendingCourse.credits,
                marks: pendingCourse.marks
            });
            console.log(`Matched (Combined): ${pendingCourse.name} [${pendingCourse.grade}]`);
            pendingCourse = null;
        }
        else if (pendingCourse && !lowerLine.includes('total') && parts.length < 10) {
            pendingCourse.name += ' ' + line;
        }
    }

    if (currentSemester && currentSemester.courses.length > 0) {
        semesters.push(currentSemester);
    }

    console.log('Total semesters parsed:', semesters.length);
    return semesters;
}
