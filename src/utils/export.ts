import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import { ExamData } from '../types';

/* =========================
   CHECK PLATFORM
========================= */
const isNative = () => !!(window as any).Capacitor?.isNativePlatform();

/* =========================
   WORD EXPORT (FIXED)
========================= */
export const exportWord = async (exam: ExamData) => {
  try {
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

    if (isNative()) {
      const saved = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });

      await Share.share({
        title: 'Word File',
        url: saved.uri,
      });
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
    }
  } catch (err) {
    console.error('WORD ERROR:', err);
    alert('خطا در ساخت فایل Word');
  }
};

/* =========================
   PDF EXPORT (REAL FIX)
========================= */
export const exportPDF = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('صفحه پیدا نشد');
      return;
    }

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

    const fileName = `exam_${Date.now()}.pdf`;

    if (isNative()) {
      const saved = await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });

      await Share.share({
        title: 'PDF File',
        url: saved.uri,
      });
    } else {
      pdf.save(fileName);
    }
  } catch (err) {
    console.error('PDF ERROR:', err);
    alert('خطا در ساخت PDF');
  }
};

/* =========================
   UTIL
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
