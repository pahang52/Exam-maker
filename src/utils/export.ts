import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExamData } from '../types';
import { Document, Packer, Paragraph, TextRun } from 'docx';

/* ======================
   PDF EXPORT (FIXED)
====================== */
export const exportPDF = async (elementId: string) => {
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

  pdf.save(`exam_${Date.now()}.pdf`);
};

/* ======================
   WORD EXPORT (FIXED)
====================== */
export const exportWord = async (exam: ExamData) => {
  const doc = new Document({
    sections: [
      {
        children: exam.questions.map(
          (q, i) =>
            new Paragraph({
              children: [
                new TextRun(`${i + 1}) ${q.text} (${q.score})`),
              ],
            })
        ),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = `exam_${Date.now()}.docx`;
  a.click();
};
