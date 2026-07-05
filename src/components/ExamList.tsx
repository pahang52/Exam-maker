import React from 'react';
import { ExamData } from '../types';
import { exportPDF, exportWord } from '../utils/export';

interface Props {
  exams: ExamData[];
}

const ExamList: React.FC<Props> = ({ exams }) => {
  if (!exams.length) {
    return <div className="text-center mt-10">هیچ آزمونی نیست</div>;
  }

  return (
    <div className="space-y-4">

      {exams.map((exam, i) => (
        <div key={exam.id} className="bg-white p-3 rounded shadow">

          <h2>{exam.header.examTitle || 'آزمون'}</h2>
          <p>درس: {exam.header.subject}</p>
          <p>نمره کل: {exam.totalScore}</p>

          <div className="mt-2">
            {exam.questions.map((q, i) => (
              <div key={q.id}>
                {i + 1}) {q.text} ({q.score})
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-3">

            <button
              onClick={() => exportPDF(exam)}
              className="bg-red-500 text-white px-3 py-1"
            >
              PDF
            </button>

            <button
              onClick={() => exportWord(exam)}
              className="bg-blue-500 text-white px-3 py-1"
            >
              Word
            </button>

          </div>

        </div>
      ))}

    </div>
  );
};

export default ExamList;
