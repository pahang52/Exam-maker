import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ExamData } from '../types';

/* ======================
   NATIVE CHECK
====================== */
const isNative = () =>
  typeof window !== 'undefined' &&
  (window as any).Capacitor?.isNativePlatform?.();

/* ======================
   BASE64 HELPER
====================== */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(blob);
  });
};

/* ======================
   WORD EXPORT (FIXED)
====================== */
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
  } catch (e) {
    console.error('WORD ERROR:', e);
    alert('خطا در ساخت Word');
  }
};

/* ======================
   PDF EXPORT (FIXED APK SAFE)
====================== */
export const exportPDF = async (exam: ExamData) => {
  try {
    // ساخت HTML موقت
    const container = document.createElement('div');
    container.style.width = '800px';
    container.style.padding = '20px';
    container.style.fontFamily = 'Arial';

    container.innerHTML = `
      <h2 style="text-align:center">آزمون</h2>
      ${exam.questions
        .map(
          (q, i) => `
        <p>${i + 1}) ${q.text} (${q.score})</p>
      `
        )
        .join('')}
    `;

    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      scrollY: 0,
    });

    document.body.removeChild(container);

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
  } catch (e) {
    console.error('PDF ERROR:', e);
    alert('خطا در ساخت PDF');
  }
};
