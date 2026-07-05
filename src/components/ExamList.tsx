import React from "react";
import { ExamData } from "../types";
import { exportPDF, exportWord } from "../utils/export";

interface Props {
  exams: ExamData[];
  onEdit: (exam: ExamData) => void;
  onRefresh: () => void;
}

const ExamList: React.FC<Props> = ({ exams, onEdit, onRefresh }) => {
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
        const containerId = `exam-${index}`;

        return (
          <div key={index} className="bg-white border rounded-xl p-4 shadow">

            {/* HEADER */}
            <div className="flex justify-between mb-3">
              <div>
                <h2 className="font-bold">
                  {exam.header?.examTitle || "آزمون"}
                </h2>
                <p className="text-sm text-gray-500">
                  {exam.header?.subject || "-"}
                </p>
              </div>

              <div className="text-sm">
                {exam.totalScore} نمره
              </div>
            </div>

            {/* CONTENT */}
            <div id={containerId} className="bg-gray-50 p-3 rounded">
              {exam.questions.map((q, i) => (
                <div key={q.id} className="border-b py-1 text-sm">
                  {i + 1}) {q.text} ({q.score})
                </div>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 mt-3">

              <button
                onClick={() => exportPDF(containerId)}
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
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                ویرایش
              </button>

              <button
                onClick={onRefresh}
                className="bg-gray-600 text-white px-3 py-1 rounded"
              >
                بروزرسانی
              </button>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExamList;
