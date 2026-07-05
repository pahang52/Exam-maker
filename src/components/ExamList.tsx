import React from "react";
import { ExamData } from "../types";
import { exportPDF, exportWord } from "../utils/export";

interface Props {
  exams: ExamData[];
  onEdit: (exam: ExamData) => void;
  onRefresh: () => void;
}

const ExamList: React.FC<Props> = ({ exams, onEdit }) => {
  if (!exams.length) {
    return <div className="text-center text-gray-500">آزمایشی وجود ندارد</div>;
  }

  return (
    <div className="space-y-4">

      {exams.map((exam, i) => {
        const id = `exam-${i}`;

        return (
          <div key={i} className="bg-white p-4 rounded shadow">

            <div className="flex justify-between mb-2">
              <div>
                <b>{exam.header.examTitle || "آزمون"}</b>
                <p className="text-sm text-gray-500">{exam.header.subject}</p>
              </div>

              <div>نمره: {exam.totalScore}</div>
            </div>

            <div id={id} className="bg-gray-50 p-3 rounded">
              {exam.questions.map((q, i) => (
                <div key={q.id} className="border-b py-1 text-sm">
                  {i + 1}) {q.text} ({q.score})
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">

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

              <button
                onClick={() => onEdit(exam)}
                className="bg-gray-500 text-white px-3 py-1 rounded"
              >
                ویرایش
              </button>

            </div>

          </div>
        );
      })}

    </div>
  );
};

export default ExamList;
