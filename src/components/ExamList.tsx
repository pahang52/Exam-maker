import React from 'react';
import { ExamData } from '../types';
import { exportPDF, exportWord } from '../utils/export';

interface Props {
  exams: ExamData[];
}

const ExamList: React.FC<Props> = ({ exams }) => {
  if (!exams?.length) {
    return (
      <div className="text-center text-gray-500 mt-10">
        هیچ آزمونی ساخته نشده است
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {exams.map((exam, index) => {
        const id = `exam-${index}`;

        return (
          <div key={index} className="bg-white p-4 rounded-xl">
            
            <div id={id}>
              {exam.questions.map((q, i) => (
                <div key={i} className="py-1 border-b">
                  {i + 1}) {q.text} - {q.score}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-3">
              <button
                onClick={() => exportPDF(id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                PDF
              </button>

              <button
                onClick={() => exportWord(exam)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Word
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default ExamList;
