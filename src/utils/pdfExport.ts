import { ExamData, Question } from '../types';

// ⚠️ مهم: import مستقیم نداریم (برای جلوگیری از خطای Vite)
let Filesystem: any = null;
let Share: any = null;

const loadCapacitor = async () => {
  if ((window as any).Capacitor?.isNativePlatform()) {
    const fs = await import('@capacitor/filesystem');
    const sh = await import('@capacitor/share');
    Filesystem = fs.Filesystem;
    Share = sh.Share;
  }
};

export const exportToPDF = async (exam: ExamData) => {
  const html = generatePrintHTML(exam);

  // Web (مرورگر)
  if (!(window as any).Capacitor?.isNativePlatform()) {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
    return;
  }

  // Android APK
  await loadCapacitor();

  const blob = new Blob([html], { type: 'text/html' });
  const base64 = await blobToBase64(blob);

  const fileName = `exam_${Date.now()}.html`;

  const saved = await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: 'DOCUMENTS',
  });

  await Share.share({
    title: 'دانلود PDF آزمون',
    url: saved.uri,
    dialogTitle: 'اشتراک یا ذخیره PDF',
  });
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });
};

export const generatePrintHTML = (exam: ExamData): string => {
  const { header, questions } = exam;

  const grouped: Record<string, Question[]> = {
    'true-false': questions.filter(q => q.type === 'true-false'),
    'fill-blank': questions.filter(q => q.type === 'fill-blank'),
    'matching': questions.filter(q => q.type === 'matching'),
    'multiple-choice': questions.filter(q => q.type === 'multiple-choice'),
    'short-answer': questions.filter(q => q.type === 'short-answer'),
    'descriptive': questions.filter(q => q.type === 'descriptive'),
  };

  const labels: any = {
    'true-false': 'صحیح و غلط',
    'fill-blank': 'جای خالی',
    'matching': 'جورکردنی',
    'multiple-choice': 'تستی',
    'short-answer': 'کوتاه پاسخ',
    'descriptive': 'تشریحی',
  };

  let html = '';

  Object.entries(grouped).forEach(([type, qs]) => {
    if (!qs.length) return;

    html += `<h3>${labels[type]} - بارم ${qs.reduce((a, b) => a + b.score, 0)}</h3>`;

    qs.forEach((q, i) => {
      html += `<p>${i + 1}) ${q.text} (${q.score})</p>`;
    });
  });

  return `
  <html dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: sans-serif; padding: 20px; }
      h3 { background:#eee;padding:8px;border-radius:6px; }
      p { margin:8px 0; }
    </style>
  </head>
  <body>
    <h2>${header.examTitle || 'آزمون'}</h2>
    <p>${header.schoolName || ''}</p>
    <hr/>
    ${html}
  </body>
  </html>
  `;
};
