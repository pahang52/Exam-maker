import { ExamData, Question } from '../types';

export const exportToPDF = (exam: ExamData): void => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = generatePrintHTML(exam);
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 800);
};

export const generatePrintHTML = (exam: ExamData): string => {
  const { header, questions } = exam;

  const groupedQuestions: Record<string, Question[]> = {
    'true-false': questions.filter(q => q.type === 'true-false'),
    'fill-blank': questions.filter(q => q.type === 'fill-blank'),
    'matching': questions.filter(q => q.type === 'matching'),
    'multiple-choice': questions.filter(q => q.type === 'multiple-choice'),
    'short-answer': questions.filter(q => q.type === 'short-answer'),
    'descriptive': questions.filter(q => q.type === 'descriptive'),
  };

  const typeLabels: Record<string, string> = {
    'true-false': 'الف) صحیح و غلط',
    'fill-blank': 'ب) جاخالی',
    'matching': 'ج) جورکردنی',
    'multiple-choice': 'د) تستی (چهارگزینه‌ای)',
    'short-answer': 'ه) پاسخ کوتاه',
    'descriptive': 'و) تشریحی',
  };

  let questionHTML = '';

  Object.entries(groupedQuestions).forEach(([type, qs]) => {
    if (qs.length === 0) return;
    const totalSectionScore = qs.reduce((sum, q) => sum + q.score, 0);

    questionHTML += `
      <div class="section">
        <div class="section-header">
          <span class="section-title">${typeLabels[type]}</span>
          <span class="section-score">بارم: ${totalSectionScore} نمره</span>
        </div>
    `;

    qs.forEach((q, idx) => {
      questionHTML += renderQuestionHTML(q, idx + 1);
    });

    questionHTML += '</div>';
  });

  return `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>آزمون - ${header.subject || ''}</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Vazirmatn', Tahoma, Arial, sans-serif; }
    body { background: white; color: #000; font-size: 12pt; direction: rtl; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 12mm 18mm; }
    .bismillah { text-align: center; font-size: 18pt; font-weight: 700; margin-bottom: 6px; letter-spacing: 2px; }
    .header-box { border: 2px solid #000; border-radius: 6px; margin-bottom: 16px; overflow: hidden; }
    .header-top { background: #1a3a6b; color: white; text-align: center; padding: 8px 12px; }
    .header-top h1 { font-size: 14pt; font-weight: 700; margin-bottom: 2px; }
    .header-top h2 { font-size: 12pt; font-weight: 500; }
    .header-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
    .header-cell { padding: 6px 10px; border-left: 1px solid #ccc; border-top: 1px solid #ccc; }
    .header-cell:nth-child(3n) { border-left: none; }
    .header-cell .label { font-weight: 700; color: #444; font-size: 9pt; margin-bottom: 2px; }
    .header-cell .value { font-size: 11pt; min-height: 20px; border-bottom: 1px dotted #999; padding-bottom: 2px; }
    .score-bar { display: flex; background: #f0f4ff; padding: 6px 12px; border-top: 1px solid #ccc; justify-content: space-between; align-items: center; font-size: 10pt; flex-wrap: wrap; gap: 6px; }
    .section { margin-bottom: 18px; page-break-inside: avoid; }
    .section-header { display: flex; justify-content: space-between; align-items: center; background: #e3f2fd; border: 1.5px solid #1976d2; border-radius: 4px; padding: 5px 12px; margin-bottom: 10px; }
    .section-title { font-weight: 700; font-size: 12pt; color: #0d47a1; }
    .section-score { font-size: 10pt; color: #333; border: 1px solid #1976d2; padding: 2px 10px; border-radius: 12px; background: white; }
    .question { margin-bottom: 10px; padding: 8px 10px; border: 1px solid #e0e0e0; border-radius: 4px; page-break-inside: avoid; }
    .question-header { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 6px; }
    .question-num { font-weight: 700; color: #1a237e; white-space: nowrap; }
    .question-text { flex: 1; line-height: 1.9; font-size: 11pt; }
    .question-score { font-size: 9pt; color: #555; border: 1px solid #bbb; padding: 1px 8px; border-radius: 10px; white-space: nowrap; }
    .tf-options { display: flex; gap: 24px; margin-top: 6px; padding-right: 20px; }
    .tf-option { display: flex; align-items: center; gap: 6px; font-size: 11pt; }
    .tf-box { width: 16px; height: 16px; border: 1.5px solid #333; border-radius: 2px; display: inline-block; }
    .blank { display: inline-block; border-bottom: 1.5px solid #000; min-width: 80px; height: 20px; margin: 0 4px; }
    .matching-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
    .matching-col { border: 1px solid #ccc; border-radius: 4px; overflow: hidden; }
    .matching-col-title { font-weight: 700; text-align: center; background: #e8eaf6; padding: 4px; font-size: 10pt; border-bottom: 1px solid #ccc; }
    .matching-item { padding: 5px 8px; border-bottom: 1px solid #eee; font-size: 11pt; line-height: 1.6; }
    .matching-item:last-child { border-bottom: none; }
    .mc-options { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 6px; padding-right: 10px; }
    .mc-option { display: flex; align-items: center; gap: 6px; padding: 4px 8px; font-size: 11pt; }
    .mc-circle { width: 14px; height: 14px; border: 1.5px solid #333; border-radius: 50%; display: inline-block; flex-shrink: 0; }
    .answer-lines { margin-top: 8px; }
    .answer-line { border-bottom: 1px solid #ccc; height: 26px; margin-bottom: 4px; }
    .footer { margin-top: 24px; border-top: 1px solid #ccc; padding-top: 8px; display: flex; justify-content: space-between; font-size: 10pt; color: #666; }
    @media print {
      body { margin: 0; }
      .page { margin: 0; padding: 10mm 15mm; }
      .section { page-break-inside: avoid; }
      .question { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
<div class="page">
  <div class="bismillah">بسمه تعالی</div>
  <div class="header-box">
    <div class="header-top">
      <h1>اداره آموزش و پرورش</h1>
      <h2>${header.schoolName || 'دبیرستان'}</h2>
    </div>
    <div class="header-grid">
      <div class="header-cell">
        <div class="label">نام و نام خانوادگی:</div>
        <div class="value">${header.studentName || ''}</div>
      </div>
      <div class="header-cell">
        <div class="label">نام پدر:</div>
        <div class="value">${header.fatherName || ''}</div>
      </div>
      <div class="header-cell">
        <div class="label">درس:</div>
        <div class="value">${header.subject || ''}</div>
      </div>
      <div class="header-cell">
        <div class="label">پایه:</div>
        <div class="value">${header.grade || ''}</div>
      </div>
      <div class="header-cell">
        <div class="label">سال تحصیلی:</div>
        <div class="value">${header.academicYear || ''}</div>
      </div>
      <div class="header-cell">
        <div class="label">تاریخ:</div>
        <div class="value">${header.date || ''}</div>
      </div>
    </div>
    <div class="score-bar">
      <span>نام دبیر: <strong>${header.teacherName || '_______________'}</strong></span>
      <span>عنوان آزمون: <strong>${header.examTitle || 'آزمون'}</strong></span>
      <span>مجموع بارم: <strong>${exam.totalScore} نمره</strong></span>
    </div>
  </div>
  ${questionHTML}
  <div class="footer">
    <span>موفق و پیروز باشید 🌟</span>
    <span>تاریخ چاپ: ${new Date().toLocaleDateString('fa-IR')}</span>
  </div>
</div>
</body>
</html>
  `;
};

const renderQuestionHTML = (q: Question, idx: number): string => {
  switch (q.type) {
    case 'true-false':
      return `
        <div class="question">
          <div class="question-header">
            <span class="question-num">${idx})</span>
            <span class="question-text">${q.text}</span>
            <span class="question-score">${q.score} نمره</span>
          </div>
          <div class="tf-options">
            <div class="tf-option"><span class="tf-box"></span> صحیح</div>
            <div class="tf-option"><span class="tf-box"></span> غلط</div>
          </div>
        </div>
      `;

    case 'fill-blank': {
      const filledText = q.text.replace(/_{3,}/g, '<span class="blank"></span>');
      return `
        <div class="question">
          <div class="question-header">
            <span class="question-num">${idx})</span>
            <span class="question-text">${filledText}</span>
            <span class="question-score">${q.score} نمره</span>
          </div>
        </div>
      `;
    }

    case 'matching': {
      const rightLetters = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ی'];
      const leftItems = q.items.map((item, i) =>
        `<div class="matching-item">${i + 1}) ${item.left}</div>`
      ).join('');
      const rightItems = q.items.map((item, i) =>
        `<div class="matching-item">${rightLetters[i] || i + 1}) ${item.right}</div>`
      ).join('');
      return `
        <div class="question">
          <div class="question-header">
            <span class="question-num">${idx})</span>
            <span class="question-text">${q.text || 'موارد ستون الف را با ستون ب جور کنید.'}</span>
            <span class="question-score">${q.score} نمره</span>
          </div>
          <div class="matching-container">
            <div class="matching-col">
              <div class="matching-col-title">ستون الف</div>${leftItems}
            </div>
            <div class="matching-col">
              <div class="matching-col-title">ستون ب</div>${rightItems}
            </div>
          </div>
        </div>
      `;
    }

    case 'multiple-choice': {
      const letters = ['الف', 'ب', 'ج', 'د'];
      const optionsHTML = q.options.map((opt, i) =>
        `<div class="mc-option"><span class="mc-circle"></span> ${letters[i] || i + 1}) ${opt.text}</div>`
      ).join('');
      return `
        <div class="question">
          <div class="question-header">
            <span class="question-num">${idx})</span>
            <span class="question-text">${q.text}</span>
            <span class="question-score">${q.score} نمره</span>
          </div>
          <div class="mc-options">${optionsHTML}</div>
        </div>
      `;
    }

    case 'short-answer':
      return `
        <div class="question">
          <div class="question-header">
            <span class="question-num">${idx})</span>
            <span class="question-text">${q.text}</span>
            <span class="question-score">${q.score} نمره</span>
          </div>
          <div class="answer-lines">
            <div class="answer-line"></div>
            <div class="answer-line"></div>
          </div>
        </div>
      `;

    case 'descriptive': {
      const lines = Array(q.lines || 5).fill(0).map(() => '<div class="answer-line"></div>').join('');
      return `
        <div class="question">
          <div class="question-header">
            <span class="question-num">${idx})</span>
            <span class="question-text">${q.text}</span>
            <span class="question-score">${q.score} نمره</span>
          </div>
          <div class="answer-lines">${lines}</div>
        </div>
      `;
    }

    default:
      return '';
  }
};
