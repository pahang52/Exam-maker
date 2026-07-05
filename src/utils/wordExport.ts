import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  convertInchesToTwip,
} from 'docx';

import { saveAs } from 'file-saver';
import { ExamData, Question } from '../types';

/* =========================
   RTL TEXT HELPER (PRO)
========================= */
const rtlText = (text: string, bold = false, size = 24, color = '000000') =>
  new TextRun({
    text,
    bold,
    size,
    color,
    rightToLeft: true,
  });

const rtlPara = (text: string, opts?: {
  bold?: boolean;
  size?: number;
  color?: string;
  indent?: number;
}) =>
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    indent: opts?.indent
      ? { right: convertInchesToTwip(opts.indent) }
      : undefined,
    children: [
      new TextRun({
        text,
        bold: opts?.bold ?? false,
        size: opts?.size ?? 24,
        color: opts?.color ?? '000000',
        rightToLeft: true,
      }),
    ],
  });

/* =========================
   SECTION HEADER
========================= */
const sectionHeader = (title: string, score: number) =>
  new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    spacing: { before: 250, after: 120 },
    shading: {
      type: ShadingType.SOLID,
      color: 'E3F2FD',
    },
    children: [
      rtlText(title, true, 28, '0D47A1'),
      rtlText(`   |   بارم: ${score}`, false, 22, '333333'),
    ],
  });

/* =========================
   MAIN EXPORT WORD
========================= */
export const exportToWord = async (exam: ExamData) => {
  const { header, questions } = exam;

  const children: (Paragraph | Table)[] = [];

  /* -------------------------
     BISMILLAH
  ------------------------- */
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [rtlText('بسمه تعالی', true, 40)],
    })
  );

  /* -------------------------
     HEADER TABLE (PRO)
  ------------------------- */
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 2 },
      bottom: { style: BorderStyle.SINGLE, size: 2 },
      left: { style: BorderStyle.SINGLE, size: 2 },
      right: { style: BorderStyle.SINGLE, size: 2 },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 3,
            shading: { type: ShadingType.SOLID, color: '1A3A6B' },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  rtlText('اداره آموزش و پرورش', true, 32, 'FFFFFF'),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  rtlText(header.schoolName || 'دبیرستان', false, 28, 'FFFFFF'),
                ],
              }),
            ],
          }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({ children: [rtlPara(`نام: ${header.studentName || ''}`)] }),
          new TableCell({ children: [rtlPara(`پدر: ${header.fatherName || ''}`)] }),
          new TableCell({ children: [rtlPara(`درس: ${header.subject || ''}`)] }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({ children: [rtlPara(`پایه: ${header.grade || ''}`)] }),
          new TableCell({ children: [rtlPara(`سال: ${header.academicYear || ''}`)] }),
          new TableCell({ children: [rtlPara(`تاریخ: ${header.date || ''}`)] }),
        ],
      }),

      new TableRow({
        children: [
          new TableCell({
            children: [rtlPara(`دبیر: ${header.teacherName || ''}`, { bold: true })],
          }),
          new TableCell({
            children: [rtlPara(`عنوان: ${header.examTitle || 'آزمون'}`, { bold: true })],
          }),
          new TableCell({
            children: [rtlPara(`بارم کل: ${exam.totalScore}`, { bold: true })],
          }),
        ],
      }),
    ],
  });

  children.push(headerTable);
  children.push(new Paragraph({ spacing: { after: 300 }, children: [] }));

  /* -------------------------
     GROUP QUESTIONS
  ------------------------- */
  const grouped: Record<string, Question[]> = {
    'true-false': questions.filter(q => q.type === 'true-false'),
    'fill-blank': questions.filter(q => q.type === 'fill-blank'),
    'matching': questions.filter(q => q.type === 'matching'),
    'multiple-choice': questions.filter(q => q.type === 'multiple-choice'),
    'short-answer': questions.filter(q => q.type === 'short-answer'),
    'descriptive': questions.filter(q => q.type === 'descriptive'),
  };

  const labels: Record<string, string> = {
    'true-false': 'صحیح / غلط',
    'fill-blank': 'جای خالی',
    'matching': 'جورکردنی',
    'multiple-choice': 'چهارگزینه‌ای',
    'short-answer': 'پاسخ کوتاه',
    'descriptive': 'تشریحی',
  };

  Object.entries(grouped).forEach(([type, qs]) => {
    if (!qs.length) return;

    const total = qs.reduce((s, q) => s + q.score, 0);
    children.push(sectionHeader(labels[type], total));

    qs.forEach((q, i) => {
      children.push(...renderQuestion(q, i + 1));
    });
  });

  /* -------------------------
     FOOTER
  ------------------------- */
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [rtlText('موفق باشید 🌟', false, 26, '555555')],
    })
  );

  /* -------------------------
     DOC BUILD
  ------------------------- */
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.7),
              bottom: convertInchesToTwip(0.7),
              left: convertInchesToTwip(0.8),
              right: convertInchesToTwip(0.8),
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(
    blob,
    `exam_${header.subject || 'file'}_${Date.now()}.docx`
  );
};

/* =========================
   QUESTION RENDERER PRO
========================= */
const renderQuestion = (q: Question, idx: number): (Paragraph | Table)[] => {
  const out: (Paragraph | Table)[] = [];

  /* Question Header */
  out.push(
    new Paragraph({
      bidirectional: true,
      spacing: { before: 120, after: 80 },
      children: [
        rtlText(`${idx}) `, true, 24, '1A237E'),
        rtlText(q.text, false, 24),
        rtlText(`   [${q.score} نمره]`, false, 20, '666666'),
      ],
    })
  );

  switch (q.type) {

    case 'true-false':
      out.push(
        rtlPara('☐ صحیح        ☐ غلط', false, 22)
      );
      break;

    case 'fill-blank':
      out.push(
        rtlPara(q.text.replace(/_{3,}/g, '__________'))
      );
      break;

    case 'multiple-choice':
      q.options?.forEach(opt => {
        out.push(
          rtlPara(`○ ${opt.text}`, false, 22, undefined, 0.2)
        );
      });
      break;

    case 'short-answer':
      out.push(
        rtlPara('پاسخ: __________________________')
      );
      break;

    case 'descriptive':
      for (let i = 0; i < (q.lines || 5); i++) {
        out.push(
          rtlPara('________________________________________________')
        );
      }
      break;

    case 'matching':
      if (q.items?.length) {
        out.push(
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: q.items.map((it, i) =>
              new TableRow({
                children: [
                  new TableCell({ children: [rtlPara(`${i + 1}) ${it.left}`)] }),
                  new TableCell({ children: [rtlPara(`${i + 1}) ${it.right}`)] }),
                ],
              })
            ),
          })
        );
      }
      break;
  }

  return out;
};
