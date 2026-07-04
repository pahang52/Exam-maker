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
} from 'docx';
import { saveAs } from 'file-saver';
import { ExamData, Question } from '../types';

const rtlParagraph = (text: string, options?: {
  bold?: boolean;
  size?: number;
  color?: string;
  alignment?: typeof AlignmentType[keyof typeof AlignmentType];
}) => {
  return new Paragraph({
    bidirectional: true,
    alignment: options?.alignment || AlignmentType.RIGHT,
    children: [
      new TextRun({
        text,
        bold: options?.bold || false,
        size: options?.size || 24,
        color: options?.color || '000000',
        rightToLeft: true,
      }),
    ],
  });
};

const sectionHeader = (title: string, score: number) => {
  return new Paragraph({
    bidirectional: true,
    alignment: AlignmentType.RIGHT,
    shading: {
      type: ShadingType.SOLID,
      color: 'E3F2FD',
    },
    spacing: { before: 200, after: 100 },
    children: [
      new TextRun({
        text: `${title}     `,
        bold: true,
        size: 28,
        color: '0D47A1',
        rightToLeft: true,
      }),
      new TextRun({
        text: `بارم: ${score} نمره`,
        bold: false,
        size: 22,
        color: '333333',
        rightToLeft: true,
      }),
    ],
  });
};

export const exportToWord = async (exam: ExamData): Promise<void> => {
  const { header, questions } = exam;

  const children: (Paragraph | Table)[] = [];

  // Bismillah
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'بسمه تعالی',
          bold: true,
          size: 36,
          rightToLeft: true,
        }),
      ],
    })
  );

  // Header Table
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
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
                  new TextRun({
                    text: 'اداره آموزش و پرورش',
                    bold: true,
                    size: 32,
                    color: 'FFFFFF',
                    rightToLeft: true,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: header.schoolName || 'دبیرستان',
                    size: 28,
                    color: 'FFFFFF',
                    rightToLeft: true,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [rtlParagraph(`نام و نام خانوادگی: ${header.studentName || ''}`, { bold: false })],
          }),
          new TableCell({
            children: [rtlParagraph(`نام پدر: ${header.fatherName || ''}`, { bold: false })],
          }),
          new TableCell({
            children: [rtlParagraph(`درس: ${header.subject || ''}`, { bold: false })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [rtlParagraph(`پایه: ${header.grade || ''}`, { bold: false })],
          }),
          new TableCell({
            children: [rtlParagraph(`سال تحصیلی: ${header.academicYear || ''}`, { bold: false })],
          }),
          new TableCell({
            children: [rtlParagraph(`تاریخ: ${header.date || ''}`, { bold: false })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [rtlParagraph(`نام دبیر: ${header.teacherName || ''}`, { bold: true })],
          }),
          new TableCell({
            children: [rtlParagraph(`عنوان: ${header.examTitle || 'آزمون'}`, { bold: true })],
          }),
          new TableCell({
            children: [rtlParagraph(`مجموع بارم: ${exam.totalScore} نمره`, { bold: true })],
          }),
        ],
      }),
    ],
  });

  children.push(headerTable);
  children.push(new Paragraph({ spacing: { before: 200, after: 200 }, children: [] }));

  // Questions
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

  Object.entries(groupedQuestions).forEach(([type, qs]) => {
    if (qs.length === 0) return;
    const totalScore = qs.reduce((sum, q) => sum + q.score, 0);

    children.push(sectionHeader(typeLabels[type], totalScore));

    qs.forEach((q, idx) => {
      children.push(...renderQuestionWord(q, idx + 1));
    });

    children.push(new Paragraph({ spacing: { before: 100, after: 100 }, children: [] }));
  });

  // Footer
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: 'موفق و پیروز باشید 🌟',
          size: 24,
          color: '555555',
          rightToLeft: true,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `آزمون_${header.subject || 'سوالات'}_${new Date().toLocaleDateString('fa-IR').replace(/\//g, '-')}.docx`);
};

const renderQuestionWord = (q: Question, idx: number): (Paragraph | Table)[] => {
  const result: (Paragraph | Table)[] = [];

  switch (q.type) {
    case 'true-false':
      result.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: `${idx}) `, bold: true, size: 24, color: '1A237E', rightToLeft: true }),
            new TextRun({ text: q.text, size: 24, rightToLeft: true }),
            new TextRun({ text: `    [بارم: ${q.score}]`, size: 20, color: '666666', rightToLeft: true }),
          ],
        }),
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 40, after: 100 },
          children: [
            new TextRun({ text: '☐ صحیح      ☐ غلط', size: 22, rightToLeft: true }),
          ],
        })
      );
      break;

    case 'fill-blank':
      result.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, after: 100 },
          children: [
            new TextRun({ text: `${idx}) `, bold: true, size: 24, color: '1A237E', rightToLeft: true }),
            new TextRun({ text: q.text, size: 24, rightToLeft: true }),
            new TextRun({ text: `    [بارم: ${q.score}]`, size: 20, color: '666666', rightToLeft: true }),
          ],
        })
      );
      break;

    case 'matching': {
      result.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, after: 80 },
          children: [
            new TextRun({ text: `${idx}) `, bold: true, size: 24, color: '1A237E', rightToLeft: true }),
            new TextRun({ text: q.text || 'موارد ستون الف را با ستون ب جور کنید.', size: 24, rightToLeft: true }),
            new TextRun({ text: `    [بارم: ${q.score}]`, size: 20, color: '666666', rightToLeft: true }),
          ],
        })
      );

      const rightLetters = ['الف', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح'];
      const matchingTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                shading: { type: ShadingType.SOLID, color: 'E8EAF6' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'ستون الف', bold: true, size: 22, rightToLeft: true })],
                  }),
                ],
              }),
              new TableCell({
                shading: { type: ShadingType.SOLID, color: 'E8EAF6' },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: 'ستون ب', bold: true, size: 22, rightToLeft: true })],
                  }),
                ],
              }),
            ],
          }),
          ...q.items.map((item, i) =>
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      bidirectional: true,
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ text: `${i + 1}) ${item.left}`, size: 22, rightToLeft: true })],
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      bidirectional: true,
                      alignment: AlignmentType.RIGHT,
                      children: [new TextRun({ text: `${rightLetters[i] || i + 1}) ${item.right}`, size: 22, rightToLeft: true })],
                    }),
                  ],
                }),
              ],
            })
          ),
        ],
      });
      result.push(matchingTable);
      result.push(new Paragraph({ spacing: { before: 80 }, children: [] }));
      break;
    }

    case 'multiple-choice': {
      const letters = ['الف', 'ب', 'ج', 'د'];
      result.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: `${idx}) `, bold: true, size: 24, color: '1A237E', rightToLeft: true }),
            new TextRun({ text: q.text, size: 24, rightToLeft: true }),
            new TextRun({ text: `    [بارم: ${q.score}]`, size: 20, color: '666666', rightToLeft: true }),
          ],
        })
      );
      q.options.forEach((opt, i) => {
        result.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.RIGHT,
            spacing: { before: 30, after: 30 },
            indent: { right: 400 },
            children: [
              new TextRun({ text: `○ ${letters[i] || i + 1}) ${opt.text}`, size: 22, rightToLeft: true }),
            ],
          })
        );
      });
      result.push(new Paragraph({ spacing: { before: 60 }, children: [] }));
      break;
    }

    case 'short-answer':
      result.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: `${idx}) `, bold: true, size: 24, color: '1A237E', rightToLeft: true }),
            new TextRun({ text: q.text, size: 24, rightToLeft: true }),
            new TextRun({ text: `    [بارم: ${q.score}]`, size: 20, color: '666666', rightToLeft: true }),
          ],
        }),
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 30, after: 100 },
          children: [new TextRun({ text: 'پاسخ: ___________________________', size: 22, color: '999999', rightToLeft: true })],
        })
      );
      break;

    case 'descriptive': {
      result.push(
        new Paragraph({
          bidirectional: true,
          alignment: AlignmentType.RIGHT,
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: `${idx}) `, bold: true, size: 24, color: '1A237E', rightToLeft: true }),
            new TextRun({ text: q.text, size: 24, rightToLeft: true }),
            new TextRun({ text: `    [بارم: ${q.score}]`, size: 20, color: '666666', rightToLeft: true }),
          ],
        })
      );
      const lineCount = q.lines || 5;
      for (let i = 0; i < lineCount; i++) {
        result.push(
          new Paragraph({
            spacing: { before: 20, after: 20 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
            },
            children: [new TextRun({ text: ' ', size: 28 })],
          })
        );
      }
      result.push(new Paragraph({ spacing: { before: 80 }, children: [] }));
      break;
    }
  }

  return result;
};
