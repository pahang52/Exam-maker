import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  WidthType,
  Table,
  TableRow,
  TableCell,
} from 'docx';

import { ExamData, Question } from '../types';

// Capacitor lazy load (حل مشکل build)
let Filesystem: any = null;
let Share: any = null;

const loadCapacitor = async () => {
  if ((window as any).Capacitor?.isNativePlatform()) {
    Filesystem = (await import('@capacitor/filesystem')).Filesystem;
    Share = (await import('@capacitor/share')).Share;
  }
};

export const exportToWord = async (exam: ExamData) => {
  const doc = buildDoc(exam);

  const blob = await Packer.toBlob(doc);

  // Web
  if (!(window as any).Capacitor?.isNativePlatform()) {
    const { saveAs } = await import('file-saver');
    saveAs(blob, `exam.docx`);
    return;
  }

  // Android APK
  await loadCapacitor();

  const base64 = await blobToBase64(blob);

  const fileName = `exam_${Date.now()}.docx`;

  const saved = await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: 'DOCUMENTS',
  });

  await Share.share({
    title: 'دانلود Word',
    url: saved.uri,
  });
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(blob);
  });

const buildDoc = (exam: ExamData) => {
  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'بسمه تعالی', bold: true, size: 32 })],
    })
  );

  children.push(
    new Paragraph({
      text: exam.header.examTitle || 'آزمون',
      alignment: AlignmentType.CENTER,
    })
  );

  exam.questions.forEach((q: Question, i: number) => {
    children.push(
      new Paragraph({
        text: `${i + 1}) ${q.text} (${q.score})`,
        spacing: { after: 200 },
      })
    );
  });

  return new Document({
    sections: [{ children }],
  });
};
