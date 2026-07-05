import React from 'react';
import { ExamData } from '../types';
import { exportToPDF } from '../utils/pdfExport';
import { exportToWord } from '../utils/wordExport';

interface Props {
  exams: ExamData[];
}

const ExamList: React.FC<Props> = ({ exams }) => {
  if (!exams || exams.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        هیچ آزمونی ساخته نشده است
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {exams.map((exam, index) => {
        const containerId = `exam-${exam.header?.subject || 'exam'}-${index}`;

        return (
          <div
            key={index}
            className="bg-white border rounded-xl shadow-sm p-4"
          >

            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {exam.header?.examTitle || 'آزمون'}
                </h2>
                <p className="text-sm text-gray-500">
                  درس: {exam.header?.subject || '-'}
                </p>
              </div>

              <div className="text-sm text-gray-600">
                مجموع بارم: {exam.totalScore}
              </div>
            </div>

            {/* ================= EXAM CONTENT ================= */}
            <div id={containerId} className="bg-gray-50 p-3 rounded-lg">
              {exam.questions.map((q, i) => (
                <div
                  key={q.id || i}
                  className="border-b py-2 last:border-none"
                >
                  <div className="flex gap-2">
                    <span className="font-bold text-blue-700">
                      {i + 1})
                    </span>
                    <div className="flex-1 text-sm text-gray-800">
                      {q.text}
                    </div>
                    <span className="text-xs text-gray-500">
                      {q.score} نمره
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ================= ACTION BUTTONS ================= */}
            <div className="flex gap-3 mt-4">

              {/* PDF */}
              <button
                onClick={() => exportToPDF(containerId, exam)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                دانلود PDF
              </button>

              {/* WORD */}
              <button
                onClick={() => exportToWord(exam)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition"
              >
                دانلود Word
              </button>

            </div>
          </div>
        );
      })}

    </div>
  );
};

export default ExamList;
