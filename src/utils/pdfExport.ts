import { ExamData, Question } from '../types';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/* =========================
   🔥 PDF / HTML EXPORT PRO
========================= */
export const exportToPDF = async (exam: ExamData): Promise<void> => {
  const htmlContent = generatePrintHTML(exam);

  const base64 = await toBase64(htmlContent);

  const fileName = `exam-${Date.now()}.html`;

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Documents,
  });

  const uri = await Filesystem.getUri({
    directory: Directory.Documents,
    path: fileName,
  });

  await Share.share({
    title: 'PDF Exam',
    url: uri.uri,
  });
};

/* =========================
   🟦 WORD EXPORT PRO
========================= */
export const exportToWord = async (exam: ExamData): Promise<void> => {
  const html = generatePrintHTML(exam);

  const wordHTML = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
        xmlns:w="urn:schemas-microsoft-com:office:word"
        xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <title>Exam</title>
  </head>
  <body>
    ${html}
  </body>
  </html>
  `;

  const base64 = btoa(unescape(encodeURIComponent(wordHTML)));

  const fileName = `exam-${Date.now()}.doc`;

  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Documents,
    mimeType: 'application/msword',
  });

  const uri = await Filesystem.getUri({
    directory: Directory.Documents,
    path: fileName,
  });

  await Share.share({
    title: 'Word Exam',
    url: uri.uri,
  });
};

/* =========================
   🖨️ PRINT (A4 PRO)
========================= */
export const printExam = (exam: ExamData): void => {
  const html = generatePrintHTML(exam);

  const win = window.open('', '_blank');
  if (!win) return;

  win.document.open();
  win.document.write(`
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: Vazirmatn, Arial;
          direction: rtl;
          padding: 20px;
        }

        @page {
          size: A4;
          margin: 20mm;
        }

        .question {
          page-break-inside: avoid;
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);

  win.document.close();

  setTimeout(() => win.print(), 500);
};

/* =========================
   📄 HTML GENERATOR (YOUR ORIGINAL)
========================= */
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
    'multiple-choice': 'د) تستی',
    'short-answer': 'ه) کوتاه پاسخ',
    'descriptive': 'و) تشریحی',
  };

  let questionHTML = '';

  Object.entries(groupedQuestions).forEach(([type, qs]) => {
    if (!qs.length) return;

    questionHTML += `
      <div class="section">
        <div class="section-header">
          <span>${typeLabels[type]}</span>
        </div>
    `;

    qs.forEach((q, i) => {
      questionHTML += `
        <div class="question">
          <div class="q-head">
            <b>${i + 1})</b> ${q.text}
            <span>${q.score} نمره</span>
          </div>
        </div>
      `;
    });

    questionHTML += `</div>`;
  });

  return `
  <html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Vazirmatn, Arial;
        direction: rtl;
        font-size: 12pt;
      }

      .section {
        margin-bottom: 15px;
        border: 1px solid #ccc;
        padding: 10px;
      }

      .section-header {
        font-weight: bold;
        margin-bottom: 8px;
      }

      .question {
        margin: 6px 0;
        padding: 6px;
        border-bottom: 1px dashed #ddd;
      }

      .q-head {
        display: flex;
        justify-content: space-between;
      }
    </style>
  </head>
  <body>
    <h2 style="text-align:center">${header.subject || ''}</h2>
    ${questionHTML}
  </body>
  </html>
  `;
};

/* =========================
   🔧 BASE64 HELPER
========================= */
const toBase64 = (str: string): Promise<string> =>
  new Promise((resolve) => {
    const blob = new Blob([str], { type: 'text/html' });
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(',')[1] || '';
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
