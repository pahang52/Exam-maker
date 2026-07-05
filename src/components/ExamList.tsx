import React from "react";
import { ExamData } from "../types";
import { exportPDF, exportWord } from "../utils/export";

interface Props {
  exams: ExamData[];
  onEdit: (exam: ExamData) => void;
}

export default function ExamList({ exams, onEdit }: Props) {
  if (!exams.length) return <div>هیچ آزمونی نیست</div>;

  return (
    <div className="p-4 space-y-4">
      {exams.map((exam, i) => {
        const id = `exam-${i}`;

        return (
          <div key={i} className="bg-white p-3 rounded shadow">

            <div id={id}>
              <h3>{exam.header.examTitle}</h3>

              {exam.questions.map((q, idx) => (
                <div key={q.id}>
                  {idx + 1}) {q.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={() => exportPDF(id)}>PDF</button>
              <button onClick={() => exportWord(exam)}>Word</button>
              <button onClick={() => onEdit(exam)}>ویرایش</button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
