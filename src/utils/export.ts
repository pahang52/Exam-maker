import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { ExamData } from '../types';

/* =========================
   CHECK NATIVE
========================= */
const isNative = () =>
  !!(window as any).Capacitor?.isNativePlatform();

/* =========================
   CREATE BASE64
========================= */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
};

/* =========================
   PDF EXPORT (ANDROID READY)
========================= */
export const exportPDF = async (
  elementId: string,
  fileName = `exam_${Date.now()}`
) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('PDF element not found');

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, width, height);

  const blob = pdf.output('blob');
  const base64 = await blobToBase64(blob);

  const path = `exam/${fileName}.pdf`;

  if (isNative()) {
    const saved = await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });

    await Share.share({
      title: 'PDF Exam',
      text: 'فایل آزمون PDF',
      url: saved.uri,
      dialogTitle: 'اشتراک گذاری فایل (بله / تلگرام / واتساپ)',
    });

    return saved.uri;
  } else {
    pdf.save(`${fileName}.pdf`);
  }
};

/* =========================
   WORD EXPORT (ANDROID READY)
========================= */
export const exportWord = async (exam: ExamData) => {
  const doc = new Document({
    sections: [
      {
        children: exam.questions.map(
          (q, i) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${i + 1}) ${q.text} (${q.score})`,
                }),
              ],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const base64 = await blobToBase64(blob);

  const fileName = `exam_${Date.now()}.docx`;
  const path = `exam/${fileName}`;

  if (isNative()) {
    const saved = await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Documents,
      recursive: true,
    });

    await Share.share({
      title: 'Word Exam',
      text: 'فایل Word آزمون',
      url: saved.uri,
      dialogTitle: 'اشتراک گذاری (بله / تلگرام / واتساپ)',
    });

    return saved.uri;
  } else {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  }
};
