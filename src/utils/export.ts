import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { ExamData } from '../types';

/* ======================
   CHECK NATIVE
====================== */
const isNative = () => !!(window as any).Capacitor?.isNativePlatform();

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

    const fileName = `exam_${Date.now()}.docx`;

    if (isNative()) {
      const base64 = await blobToBase64(blob);

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
    console.error(e);
    alert('خطا در ساخت Word');
  }
};

/* ======================
   PDF EXPORT (FIXED)
====================== */
export const exportPDF = async (elementId: string) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      alert('عنصر PDF پیدا نشد');
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

    const fileName = `exam_${Date.now()}.pdf`;

    if (isNative()) {
      const base64 = await blobToBase64(blob);

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
    console.error(e);
    alert('خطا در ساخت PDF');
  }
};

/* ======================
   BASE64
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
