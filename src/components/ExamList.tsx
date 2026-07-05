import React from 'react';
import { ExamData } from '../types';

interface Props {
  exams: ExamData[];
  onSelect?: (exam: ExamData) => void;
}

const ExamList: React.FC<Props> = ({ exams, onSelect }) => {
  if (!exams.length) {
    return <div>هیچ آزمونی نیست</div>;
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {exams.map((exam) => (
        <div key={exam.id} style={{ border: '1px solid #ddd', borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700 }}>{exam.header.examTitle || 'آزمون'}</div>
          <div>درس: {exam.header.subject || '-'}</div>
          <div>نمره کل: {exam.totalScore}</div>

          <div style={{ marginTop: 8 }}>
            {exam.questions.map((q, i) => (
              <div key={q.id}>
                {i + 1}) {q.text} ({q.score})
              </div>
            ))}
          </div>

          {onSelect && (
            <button type="button" onClick={() => onSelect(exam)} style={{ marginTop: 10 }}>
              باز کردن
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExamList;
